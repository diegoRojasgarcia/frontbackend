import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService, private _snackBar: MatSnackBar) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service.
    const authToken = this.authService.getToken();

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    if (authToken)
      req = req.clone({
        headers: req.headers.set('Authorization', authToken)
      });

    // send cloned request with header to the next handler.
    return next.handle(req)
  }
}
