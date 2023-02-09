import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HelpRequestModel } from '../../../core/models/help-request.model';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {

  @Output() closeFilters: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddressClicked: EventEmitter<HelpRequestModel> = new EventEmitter<HelpRequestModel>();
  @Input() requests: Record<string, HelpRequestModel>;

  form: FormGroup
  sortedRequestArray: HelpRequestModel[] = [];
  loading = false;

  constructor() {
  }

  ngOnInit(): void {
    this.initForm();
    this.initRequestArray();
  }

  initForm() {
    this.form = new FormGroup({
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      date: new FormControl(null),
      address: new FormControl(null),
    });
  }

  initRequestArray() {
    for (let requestsKey in this.requests) {
      this.sortedRequestArray.push(this.requests[requestsKey])
    }
    this.sortedRequestArray = this.sortedRequestArray.reverse();
  }

  onClickClose() {
    this.closeFilters.emit();
  }

  onFormSubmit() {
    this.initRequestArray();
    if (this.form.controls.address.value) {
      this.sortedRequestArray = this.sortedRequestArray
        .filter((item) =>
          item.address.replace(/\s+/g, '').toLowerCase()
            .includes(this.form.controls.address.value.replace(/\s+/g, '').toLowerCase()))
    }

    if(this.form.controls.date.value){
      this.sortedRequestArray = this.sortedRequestArray.filter((item)=>item.datetime?.date === this.form.controls.date.value.format('YYYY-MM-DD'))
    }
  }

  onClickClear() {
    this.initRequestArray();
    this.form.reset();
  }

  onClickAddress(item: HelpRequestModel) {
    this.onAddressClicked.emit(item);
  }
}
