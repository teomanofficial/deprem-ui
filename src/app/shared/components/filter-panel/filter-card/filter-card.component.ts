import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelpRequestModel } from '../../../../core/models/help-request.model';
import { HelpRequestResponseModel } from '../../../../core/models/help-request-response.model';

@Component({
  selector: 'app-filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.scss']
})
export class FilterCardComponent implements OnInit {

  @Input() helpRequest: HelpRequestResponseModel;
  @Output() goClick:EventEmitter<HelpRequestResponseModel> = new EventEmitter<HelpRequestResponseModel>();
  isCardBodyVisible = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onClickCardHeader() {
    this.isCardBodyVisible = !this.isCardBodyVisible;
  }

  onClickGo() {
    this.goClick.emit(this.helpRequest)
  }
}
