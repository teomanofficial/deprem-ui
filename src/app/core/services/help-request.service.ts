import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HelpRequestModel } from '../models/help-request.model';
import { HelpRequestResponseModel } from '../models/help-request-response.model';

@Injectable({ providedIn: 'root' })
export class HelpRequestService {
  constructor(private readonly http: HttpClient) {
  }

  getRequestList() {
    return this.http.get<HelpRequestResponseModel[]>('api/HelpRequests/GetHelpRequestList')
  }

  createHelpRequest(request: HelpRequestModel) {
    return this.http.post('api/HelpRequests/CreateHelpRequest', request);
  }

  deleteHelpRequest(id: number) {
    return this.http.delete('api/HelpRequests/DeleteHelpRequest/' + id);
  }
}
