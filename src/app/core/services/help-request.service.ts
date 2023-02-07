import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HelpRequestModel } from '../models/help-request.model';

@Injectable({ providedIn: 'root' })
export class HelpRequestService {
  private readonly requests = new BehaviorSubject<HelpRequestModel[]>([])

  add(request: HelpRequestModel) {
    this.requests.next([...this.requests.value, request])
  }

  getList() {
    return this.requests.asObservable();
  }
}
