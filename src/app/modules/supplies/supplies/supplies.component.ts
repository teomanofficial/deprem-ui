import { Component, OnInit } from '@angular/core';
export interface SupplyTableItem {
  no: string;
  nameSurname:string,
  contactInfo:string,
  supplyInfo:string,
  date:string,
  province:string,
  district:string
}

const MOCK_DATA: SupplyTableItem[] = [
  {
    no: '1', 
    nameSurname: 'Test Name', 
    contactInfo: 'Test Contact', 
    supplyInfo: 'test Supply Info', 
    date:'01.01.2023', 
    province:'Hatay', 
    district:'Antakya'
  },
  {
    no: '2', 
    nameSurname: 'Test Name', 
    contactInfo: 'Test Contact', 
    supplyInfo: 'test Supply Info', 
    date:'01.01.2023', 
    province:'Hatay', 
    district:'Antakya'
  },
  {
    no: '3', 
    nameSurname: 'Test Name', 
    contactInfo: 'Test Contact', 
    supplyInfo: 'test Supply Info', 
    date:'01.01.2023', 
    province:'Hatay', 
    district:'Antakya'
  },
];

@Component({
  selector: 'app-supplies',
  templateUrl: './supplies.component.html',
  styleUrls: ['./supplies.component.scss']
})
export class SuppliesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = [
    'no', 
    'request-name-surname', 
    'request-contact-info', 
    'request-supply-info', 
    'request-date', 
    'province', 
    'district'];
  dataSource = MOCK_DATA;
}
