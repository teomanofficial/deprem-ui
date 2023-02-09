import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { trimSlash } from '../utils/trim-slash.util';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PrependBaseApiUrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.match(/^https?:/)) {
      const url = `${trimSlash(environment.apis.default.url)}/${trimSlash(req.url)}`;
      req = req.clone({ url });
    }

    return next.handle(req);
  }
}
