import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { OverlayService } from '../../services/overlay/overlay.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class OverlayInterceptor implements HttpInterceptor {
  private activeRequests: HttpRequest<any>[] = [];

  constructor(private overlay: OverlayService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.params.get('overlay') === 'false' ){
      request.params.delete('overlay');
      return next.handle(request)
    }
    else if (!this.activeRequests.length)
      this.overlay.open()
    this.activeRequests.push(request)
    return next.handle(request).pipe(finalize(() => {
      this.activeRequests.pop()
      if (!this.activeRequests.length)
        this.overlay.close()
    }));
  }
}
