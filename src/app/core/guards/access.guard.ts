import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AppConstants } from '../constants/app.constants';
import { AppError } from '../models/app-error';
import { Permission } from '../../features/users-management/models/privilege';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanLoad {

  constructor(private auth: AuthenticationService, private router: Router) { };

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.checkPermission(route.data?.feature) !== Permission.NONE || throwError(new AppError(AppConstants.ACCESS_DENIED));
  }
}
