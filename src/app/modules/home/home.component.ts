import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import { LatLng, Marker } from 'leaflet';
import { GeocodingService } from '../../core/services/geocoding.service';
import * as markerClusterGroup from 'leaflet.markercluster';
import { createMarkerFromLatLng, createRegisteredMarker } from '../../core/utils/create-marker.util';
import {
  RequestDetailsCardComponent
} from '../../shared/components/request-details-card/request-details-card.component';
import { first } from 'rxjs/operators';
import { isPresentationDomain } from '../../core/utils/is-presentation-domain.util';
import { HelpRequestService } from '../../core/services/help-request.service';
import { HelpRequestResponseModel } from '../../core/models/help-request-response.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapElementRef: ElementRef<HTMLDivElement>;

  map: L.Map;
  cluster: any;
  showHelpForm: boolean;
  showFilterButton = false;
  markersLoading: boolean;
  showFilterPanel: boolean = false;
  selectedLocation: LatLng | null;
  helpLocationMarker: L.Marker | null;
  markers: Record<string, Marker> = {};
  placeholderLocationMarker: L.Marker | null;
  requests: Record<string, HelpRequestResponseModel> = {};

  constructor(
    private readonly geocoding: GeocodingService,
    private readonly requestService: HelpRequestService,
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
    this.markersLoading = true;
    this.cdr.detectChanges();
    this.requestService.getRequestList()
      .subscribe(requests => {
        for (let request of requests) {
          this.createMarker(request);
          this.requests[request.objectId] = request;
        }
        this.markersLoading = false;
        this.cdr.markForCheck();
      }, () => {
        this.markersLoading = false;
        this.cdr.markForCheck();
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
            marker.getPopup()?.close();
            delete this.markers[request.objectId];
            marker.removeFrom(this.map);
          } else {

          }
        })
    }
  }

  onCloseHelpForm(request: HelpRequestResponseModel) {
    if (this.placeholderLocationMarker) {
      this.placeholderLocationMarker.removeFrom(this.map);
      this.placeholderLocationMarker = null;
    }

    if (this.helpLocationMarker) {
      this.helpLocationMarker.removeFrom(this.map);
      this.helpLocationMarker = null;
    }

    if (request) {
      this.requests[request.objectId] = request;
      this.createMarker(request)
    }

    this.selectedLocation = null;

    this.showHelpForm = false;
  }

  private createMarker(value: HelpRequestResponseModel) {
    const { objectId, location } = value;
    const { lat, lon } = location;
    const marker = createRegisteredMarker(lat, lon);
    this.cluster.addLayer(marker);
    (marker as any)['__id__'] = objectId;
    marker.on('click', this.onMarkerClick.bind(this))
    this.markers[objectId] = marker;
  }

  onShowFilterButtonClick() {
    this.showFilterPanel = true;
  }

  onCloseFilterButtonClick() {
    this.showFilterPanel = false;
  }

  onAddressClickFromFilter(item: HelpRequestResponseModel) {
    const { lat, lon } = item.location;
    this.map.flyTo([lat, lon], 18)
  }

  showCreateHelpRequest() {
    return !isPresentationDomain();
  }

}
