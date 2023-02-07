import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { LatLng } from 'leaflet';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { GeocodingService } from '../../core/services/geocoding.service';
import { firebaseApp } from '../../core/config/firebase/db.firebase';
import { getDatabase, ref, set } from 'firebase/database';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
import { geocode } from '../../core/utils/google-reverse-geocoding.util';

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
    private readonly geocodingService: GeocodingService,
    private readonly toaster: ToastrService,
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
        date: new FormControl('2023-02-06'),
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

    const db = getDatabase(firebaseApp);

    const value = this.form.getRawValue();
    const id = uuidv4();
    value.id = id;
    const { lat, lng: lon } = this.location;
    value.location = { lat, lon };
    value.created_at = new Date().toISOString();

    set(ref(db, 'requests/' + id), value)
      .then(() => {
        this.toaster.success('Yardım talebi alındı!');
        this.closeForm.emit(value);
      })
      .catch(() => {
        this.toaster.error('Yardım talebi alınırken bir hata oluştu!');
      })
      .finally(() => {
        this.closeForm.emit();
      })
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
