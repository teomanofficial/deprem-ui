import * as L from 'leaflet';
import { LatLng, Marker } from 'leaflet';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import { child, get, getDatabase, ref } from 'firebase/database';
import { firebaseApp } from './core/config/firebase/db.firebase';
import { createMarkerFromLatLng, createRegisteredMarker } from './core/utils/create-marker.util';
import { HelpRequestModel } from './core/models/help-request.model';
import { GeocodingService } from './core/services/geocoding.service';
import { RequestDetailsCardComponent } from './components/request-details-card/request-details-card.component';
import { first } from 'rxjs/operators';
import * as markerClusterGroup from 'leaflet.markercluster'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElementRef: ElementRef<HTMLDivElement>;

  map: L.Map;
  cluster: any;
  showHelpForm: boolean;
  selectedLocation: LatLng | null;
  helpLocationMarker: L.Marker | null;
  placeholderLocationMarker: L.Marker | null;
  markers: Record<string, Marker> = {};
  requests: Record<string, HelpRequestModel>;

  constructor(
    private readonly geocoding: GeocodingService,
    private readonly cdr: ChangeDetectorRef,
    private readonly cfr: ComponentFactoryResolver,
    private readonly injector: Injector
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.registerMap();
    this.registerMapEvents();
    this.registerHelpRequests();
  }

  onAddHelpButtonClick() {
    this.showHelpForm = true;
  }

  private registerMap() {
    this.map = new L.Map(this.mapElementRef.nativeElement, {
      zoom: 8,
      preferCanvas: true,
      center: [37.5753, 36.9228],
    });
    const googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    googleStreets.addTo(this.map);
    this.cluster = new (markerClusterGroup as any).MarkerClusterGroup();
    this.map.addLayer(this.cluster);
  }

  private registerMapEvents() {
    this.map.on('click', e => {
      if (this.showHelpForm) {
        this.selectedLocation = e.latlng;
        if (this.helpLocationMarker) {
          this.helpLocationMarker.setLatLng(e.latlng)
        } else {
          if (this.placeholderLocationMarker) {
            this.placeholderLocationMarker.removeFrom(this.map);
            this.placeholderLocationMarker = null;
          }
          this.helpLocationMarker = createMarkerFromLatLng(e.latlng);
          this.helpLocationMarker.addTo(this.map);
        }
        this.cdr.markForCheck();
      }
    });
  }

  onPlaceHolderMarkerChange(coordinate: { lat: number; lon: number }) {
    const { lat, lon } = coordinate;
    const latlng = new LatLng(lat, lon);

    if (this.placeholderLocationMarker) {
      this.placeholderLocationMarker.setLatLng(latlng);
    } else {
      this.placeholderLocationMarker = createMarkerFromLatLng(latlng);
      this.placeholderLocationMarker.addTo(this.map);
    }

    this.map.flyTo(latlng, 18, { duration: 0.5 })
  }

  private registerHelpRequests() {
    const dbRef = ref(getDatabase(firebaseApp));
    get(child(dbRef, `requests`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.requests = snapshot.val();
        for (let value of Object.values(this.requests)) {
          this.createMarker(value);
        }
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  onMarkerClick(e: any) {
    const id = (e.target as any)['__id__'] as string;
    const marker = this.markers[id];

    if (marker.getPopup()) {
      marker.getPopup()?.openPopup();
    } else {
      const popup = L.popup();
      const request = this.requests[id];
      const resolver = this.cfr.resolveComponentFactory(RequestDetailsCardComponent);
      const component = resolver.create(this.injector);
      component.instance.request = request;
      component.changeDetectorRef.detectChanges();
      let div = document.createElement('div');
      div.appendChild(component.location.nativeElement);
      popup.setContent(div);
      marker.bindPopup(popup).openPopup();
      this.cdr.markForCheck();
      component.instance.close
        .pipe(first())
        .subscribe(res => {
          if (res) {
            delete this.markers[request.id];
            marker.removeFrom(this.map);
          } else {
            marker.getPopup()?.close();
          }
        })
    }
  }

  onCloseHelpForm(request: HelpRequestModel) {
    if (this.placeholderLocationMarker) {
      this.placeholderLocationMarker.removeFrom(this.map);
      this.placeholderLocationMarker = null;
    }

    if (this.helpLocationMarker) {
      this.helpLocationMarker.removeFrom(this.map);
      this.helpLocationMarker = null;
    }

    if (request) {
      this.requests[request.id] = request;
      this.createMarker(request)
    }

    this.selectedLocation = null;

    this.showHelpForm = false;
  }

  private createMarker(value: HelpRequestModel) {
    const { id, location } = value;
    const { lat, lon } = location;
    const marker = createRegisteredMarker(lat, lon);
    this.cluster.addLayer(marker);
    (marker as any)['__id__'] = id;
    marker.on('click', this.onMarkerClick.bind(this))
    this.markers[id] = marker;
  }
}


