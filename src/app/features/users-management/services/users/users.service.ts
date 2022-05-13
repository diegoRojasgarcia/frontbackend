import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CustomHttpResponse } from 'src/app/core/models/http-response';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { ValidationService } from 'src/app/core/services/validation/validation.service';
import { UserModel } from 'src/app/features/users-management/models/user.model';

const API: string = AppConstants.USERS_API;
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private valSvc: ValidationService, private auth: AuthenticationService) { }

  getUser(id: number | null): Observable<CustomHttpResponse<UserModel[]>> {
    return this.http.post<CustomHttpResponse<UserModel[]>>(API + "GetUserId", { idUser: id }).pipe(shareReplay(CACHE_SIZE));
  }

  getUserByRut(userRut: string): Observable<CustomHttpResponse<UserModel[]>> {
    return this.http.post<CustomHttpResponse<UserModel[]>>(API + "GetUser", { rut: userRut });
  }

  getUsers(): Observable<CustomHttpResponse<UserModel[]>> {
    return this.http.get<CustomHttpResponse<UserModel[]>>(API + "GetListUser").pipe(map(e => {
      e.data = e.data.filter(d => d.idUser !== this.auth.getUserId())
      return e;
    }));
  }

  editUser(user: UserModel, overlay = true): Observable<CustomHttpResponse<any>> {
    const params = new HttpParams().set("overlay", overlay);
    user.rut = this.valSvc.cleanRut(user.rut);
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateUser", user, { params: params });
  }

  addUser(user: UserModel): Observable<CustomHttpResponse<AddUser[]>> {
    user.rut = this.valSvc.cleanRut(user.rut);
    return this.http.post<CustomHttpResponse<AddUser[]>>(API + "RegisterUser", user);
  }


}

interface AddUser {
  idUser: number;
}
