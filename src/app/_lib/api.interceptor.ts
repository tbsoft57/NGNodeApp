import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

// https://github.com/angular/angular/blob/master/packages/common/http/src/xhr.ts#L18

const XSSI_PREFIX = /^\)\]\}',?\n/;

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ url: environment.apiPrefix + '/' + req.url });
    if (req.responseType === 'json') {
      return next.handle(req).pipe(map(event => {
        if (!(event instanceof HttpResponse)) return event;
        return this.processJsonResponse(event);
    })); }
    return next.handle(req);
  }

  private processJsonResponse(res: HttpResponse<string>): HttpResponse<any> {
      let body = res.body;
      if (typeof body === 'string') {
        const originalBody = body;
        body = body.replace(XSSI_PREFIX, '');
        try {
          body = body !== '' ? JSON.parse(body, (key: any, value: any) => this.reviveUtcDate(key, value)) : null;
        } catch (error) {
          // match https://github.com/angular/angular/blob/master/packages/common/http/src/xhr.ts#L221
          throw new HttpErrorResponse({
            error: { error, text: originalBody },
            headers: res.headers,
            status: res.status,
            statusText: res.statusText,
            url: res.url || undefined,
          });
        }
      }
      return res.clone({ body });
  }

  private reviveUtcDate(key: any, value: any): any {
      if (typeof value !== 'string') {
          return value;
      }
      if (value === '0001-01-01T00:00:00') {
          return null;
      }
      const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
      if (!match) {
          return value;
      }
      return new Date(value);
  }
}
