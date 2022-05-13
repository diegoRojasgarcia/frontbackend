import { HttpClient } from "@angular/common/http";
import { finalize } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication/authentication.service";

export function load(http: HttpClient, auth: AuthenticationService): (() => Promise<boolean>) {
    return (): Promise<boolean> => {
      return new Promise<boolean>((resolve: (a: boolean) => void): void => {
        auth.getPrivileges().pipe(finalize(()=>{resolve(true)})).subscribe()
      });
    };
  }