import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { LatLng } from 'leaflet';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { geocode } from '../../../core/utils/google-reverse-geocoding.util';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { HelpRequestService } from '../../../core/services/help-request.service';
import * as moment from 'moment';

@Component({
  selector: 'app-create-help-form',
  templateUrl: './create-help-form.component.html',
  styleUrls: ['./create-help-form.component.scss']
})
export class CreateHelpFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() location: LatLng | null;

  @Output() closeForm = new EventEmitter();
  @Output() placeHolderChange = new EventEmitter<{ lat: number, lon: number }>();

  form: FormGroup;
  loading: boolean;
  showDateAndTime: boolean;

  private readonly destroyed$ = new Subject();

  constructor(
    private readonly toaster: ToastrService,
    private readonly requestService: HelpRequestService,
    private readonly geocodingService: GeocodingService,
  ) {
  }

  ngOnInit(): void {
    this.registerForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.location && changes.location.currentValue) {
      this.resolveClickedAddress(changes.location.currentValue);
    }
  }

  get address() {
    return this.form.get('address')!;
  }


  private resolveClickedAddress(location: LatLng) {
    const { lat, lng } = location;
    this.geocodingService.reverse(lat, lng)
      .subscribe(response => {
        this.form.patchValue({ address: response.display_name });
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private registerForm() {
    this.form = new FormGroup({
      address: new FormControl(null, Validators.required),
      description: new FormControl(null),
      datetime: new FormGroup({
        date: new FormControl(moment().format('YYYY-MM-DD')),
        time: new FormControl()
      })
    });
  }

  onFormSubmit() {
    if (this.form.invalid) {
      for (let control of Object.values(this.form.controls)) {
        control.markAsDirty();
        control.markAsTouched();
      }
      return;
    }

    if (!this.location) {
      return;
    }

    this.loading = true;
    this.form.disable();

    const request = this.form.getRawValue();
    const { lat, lng: lon } = this.location;
    request.location = { lat, lon };
    request.created_at = new Date().toISOString();

    if (typeof request.datetime.date !== 'string') {
      request.datetime.date = request.datetime.date?.format('YYYY-MM-DD');
    }

    this.requestService.createHelpRequest(request)
      .subscribe(
        response => {
          this.toaster.success('Yardım talebi alındı!');
          this.closeForm.emit(response);
        },
        () => this.toaster.error('Yardım talebi alınırken bir hata oluştu!'),
        () => this.closeForm.emit()
      )
  }

  onGeocodingClick() {
    if (this.address.value && this.address.value.length >= 2) {
      geocode(this.address.value)
        .then((location: any) => {
          const lat = location.lat();
          const lon = location.lng();
          this.placeHolderChange.emit({ lat, lon })
        })
        .catch(e => console.log(e))
    }
  }

  onCloseClick() {
    this.closeForm.emit();
  }
}
