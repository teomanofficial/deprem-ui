import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HelpRequestModel } from '../../../core/models/help-request.model';
import { HelpRequestResponseModel } from '../../../core/models/help-request-response.model';
import * as moment from 'moment';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {

  @Output() closeFilters: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddressClicked: EventEmitter<HelpRequestResponseModel> = new EventEmitter<HelpRequestResponseModel>();
  @Input() requests: Record<string, HelpRequestResponseModel>;

  form: FormGroup
  hours:number[] = [3,6,9,12,24];
  sortedRequestArray: HelpRequestResponseModel[] = [];
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
      hour: new FormControl(null),
      address: new FormControl(null),
    });
  }

  initRequestArray() {
    for (let requestsKey in this.requests) {
      this.sortedRequestArray.push(this.requests[requestsKey])
    }
    this.sortedRequestArray = this.sortedRequestArray.reverse();
    console.log(this.sortedRequestArray)
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

    if(this.form.controls.hour.value){
      const currentTime = moment()
      // @ts-ignore
      this.sortedRequestArray = this.sortedRequestArray.filter((item)=>{
        if(item.createdAt){
          const addedTime = moment(item.createdAt).add(this.form.controls.hour.value, 'hours')
          console.log( moment(item.createdAt));
          console.log(moment(item.createdAt).add(this.form.controls.hour.value, 'hours'));
          if(addedTime.isAfter(currentTime)){
            return item;
          }
        }
      })
    }
  }

  onClickClear() {
    this.initRequestArray();
    this.form.reset();
  }

  onClickAddress(item: HelpRequestResponseModel) {
    this.onAddressClicked.emit(item);
  }
}
