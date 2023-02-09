import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { HelpRequestModel } from '../../../core/models/help-request.model';
import { database } from '../../../core/config/firebase/db.firebase';
import { child, ref, set } from 'firebase/database';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-details-card',
  templateUrl: './request-details-card.component.html',
  styleUrls: ['./request-details-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestDetailsCardComponent implements OnInit {
  @Input() request: HelpRequestModel;
  @Output() close = new EventEmitter<boolean>();

  loading: boolean;


  constructor(
    private readonly toaster: ToastrService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  onCloseClick() {
    this.close.emit();
  }

  onDeleteButton() {
    this.loading = true;
    this.cdr.markForCheck();

    set(child(ref(database, 'requests'), this.request.id), null)
      .then(() => {
        this.toaster.success('Yardım talebi kaldırıldı');
        this.close.emit(true);
        this.cdr.markForCheck();
      })
      .catch(() => {
        this.toaster.error('Yardım talebi kaldırılırken bir hata oluştu!');
        this.cdr.markForCheck();
      })
      .finally(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
  }
}
