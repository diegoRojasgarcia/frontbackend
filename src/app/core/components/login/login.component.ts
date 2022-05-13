import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { ValidationService } from '../../services/validation/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  private subs$ = new Subscription();
  hide: boolean = true;
  rutControl = new FormControl('', [
    Validators.required,
    this.rs.validateRut()
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  loginForm = new FormGroup({
    rut: this.rutControl,
    pass: this.passwordFormControl,
  })

  constructor(private authService: AuthenticationService, private router: Router, private rs: ValidationService) {
  }
  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  formatRut(): void {
    this.rutControl.setValue(this.rs.formatRut(this.rutControl.value))
  }

  submit() {
    if (this.loginForm.valid) {
      this.subs$.add(this.authService.login(this.rutControl.value, this.passwordFormControl.value).subscribe(() => this.router.navigate(['/'])));
    }
  }
}
