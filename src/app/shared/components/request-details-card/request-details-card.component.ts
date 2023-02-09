import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { HelpRequestService } from '../../../core/services/help-request.service';
import { HelpRequestResponseModel } from '../../../core/models/help-request-response.model';

@Component({
  selector: 'app-request-details-card',
  templateUrl: './request-details-card.component.html',
  styleUrls: ['./request-details-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestDetailsCardComponent implements OnInit {
  @Input() request: HelpRequestResponseModel;
  @Output() close = new EventEmitter<boolean>();

  loading: boolean;

  constructor(
    private readonly toaster: ToastrService,
    private readonly cdr: ChangeDetectorRef,
    private readonly requestService: HelpRequestService,
  ) {
  }

  ngOnInit(): void {
  }

  onCloseClick() {
    this.close.emit();
  }

  onDeleteButton() {
    this.loading = true;

    this.requestService.deleteHelpRequest(this.request.id)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      }))
      .subscribe(
        () => {
          this.toaster.success('Yardım talebi kaldırıldı');
          this.close.emit(true);
          this.cdr.markForCheck();
        },
        () => this.toaster.error('Yardım talebi kaldırılırken bir sorun oluştu!'),
      );
  }
}
