import { ErrorHandler, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AppError } from 'src/app/core/models/app-error';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { OverlayService } from '../../services/overlay/overlay.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor, ErrorHandler {

  constructor(private authService: AuthenticationService, private _snackBar: MatSnackBar, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(tap(e => {
      if (e instanceof HttpResponse && e.status == 200 && e.body.msg) {
        this.openSnackBar(e.body.msg, true);
      }
    }), catchError(this.handleError.bind(this)));;
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      } else if (error.status === 401) {
        // Access denied; clear session data
        this.authService.logout()
        this.router.navigate(['login'])
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
      const msg = error.error.msg
      if (msg)
        this.openSnackBar(error.error.msg)
      else
        this.openSnackBar(AppConstants.UNKNOWN_ERROR + ' code: ' + error.status)
      // Return an observable with a user-facing error message.

    } else if (error.rejection instanceof AppError || error instanceof AppError) {
      this.openSnackBar(error.rejection?.message.split(':').pop() || error.message?.split(':').pop() || AppConstants.UNKNOWN_ERROR);
    }
    console.error(error)
    return throwError('Something bad happened; please try again later.');

  }

  private openSnackBar(message: string, success?: boolean) {
    this._snackBar.open(message, "cerrar", { duration: 5000, panelClass: success ? 'successSnack' : '' });
  }
}
