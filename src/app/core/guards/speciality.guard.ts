import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AppConstants } from '../constants/app.constants';
import { AppError } from '../models/app-error';
import { Speciality } from '../../features/users-management/models/privilege';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SpecialityGuard implements CanLoad {

  constructor(private auth: AuthenticationService) { }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const specRef = this.auth.getSpeciality();
    return specRef === Speciality.ALL ? true : specRef === route.data?.speciality || throwError(new AppError(AppConstants.ACCESS_DENIED));
  }
}
