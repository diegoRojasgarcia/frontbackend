import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Session } from 'src/app/core/models/session';
import { shareReplay, tap } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { Features, Permission, PRIVILEGE, Speciality } from 'src/app/features/users-management/models/privilege';
import { ValidationService } from '../validation/validation.service';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private authApi = environment.authApi;
  private cache!: Observable<PRIVILEGE[]>;
  private privileges: PRIVILEGE[] = [];

  constructor(private http: HttpClient, private valSvc: ValidationService) { }

  login(rut: string, password: string): Observable<Session> {
    rut = this.valSvc.cleanRut(rut);
    return this.http.post<Session>(this.authApi + 'login', { rut: rut, password: password }).pipe(
      tap(res => this.setSession(res)),
      shareReplay()
    );
  }

  private setSession(authResult: Session): void {
    this.getPrivileges().subscribe();
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('user_id', authResult.idUser.toString());
    localStorage.setItem('privilege', authResult.privilege.toString());
    localStorage.setItem('user_name', authResult.name.toString());
    localStorage.setItem('speciality', authResult.idSpeciality!);
    localStorage.setItem('is_logged_in', 'true');
  }

  getToken(): string | null {
    return localStorage.getItem("id_token");
  }
  getUserId(): number | null {
    return Number(localStorage.getItem('user_id'));
  }
  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }
  getPrivilege(): number {
    const privilege = localStorage.getItem('privilege');
    return parseInt(privilege ? privilege : "0");
  }
  getSpeciality():string | null{
    return localStorage.getItem('speciality')
  }

  logout(): void {
    localStorage.removeItem("id_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    localStorage.removeItem("privilege");
    localStorage.removeItem("is_logged_in");
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('is_logged_in') ? true : false;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  checkPermission(feature: Features): Permission {
    const access = this.privileges.find(e => e.ID === this.getPrivilege())
    if (!access)
      return Permission.NONE;
    else {
      const permission = access.FEATURE_PERMISSION.find(e => e.FEATURE === feature);
      return permission ? permission.PERMISSION : Permission.NONE;
    }

  }

  public getPrivileges(): Observable<PRIVILEGE[]> {
    if (!this.cache)
      this.cache = this.http.get<PRIVILEGE[]>("../assets/admin/privileges.json").pipe(tap(res => this.privileges = res), shareReplay());
    return this.cache;
  }
}
