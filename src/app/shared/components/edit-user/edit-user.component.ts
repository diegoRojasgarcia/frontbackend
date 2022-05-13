import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdministrativeService } from 'src/app/core/services/administrative/administrative.service';
import { ValidationService } from 'src/app/core/services/validation/validation.service';
import { Features, Permission, Privilege } from 'src/app/features/users-management/models/privilege';
import { Profession } from 'src/app/features/users-management/models/profession';
import { Specialization } from 'src/app/features/users-management/models/specialization';
import { UserModel } from 'src/app/features/users-management/models/user.model';
import { UsersService } from 'src/app/features/users-management/services/users/users.service';

interface DialogData {
  title: string,
  user: UserModel,
  professions: Profession[],
  privileges: Privilege[],
  specialization: Specialization[];
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, OnDestroy {

  PERMISSIONS = Permission
  FEATURES = Features

  private subs$: Subscription[] = []

  professions: Profession[] = [];
  privileges: Privilege[] = [];
  specializations: Specialization[] = [];
  rutControl: FormControl;
  userForm: FormGroup;
  title: string;
  changePassword: boolean = true;
  hide: boolean = true;
  password: FormControl;//to save new pasword

  matcher = new ErrorStateMatcher();

  constructor(private diaRef: MatDialogRef<EditUserComponent>, @Inject(MAT_DIALOG_DATA) data: DialogData, private userService: UsersService, private admin: AdministrativeService, private valSvc: ValidationService) {
    this.title = data.title;
    this.rutControl = new FormControl("", [valSvc.validateRut(), Validators.required]);
    this.userForm = new FormGroup({
      rut: this.rutControl,
      name: new FormControl("", [Validators.required]),
      profession: new FormControl("", [Validators.required]),
      foundation: new FormControl(),
      privilege: new FormControl("", [Validators.required]),
      idUser: new FormControl(),
      idSpeciality: new FormControl("ALL", [Validators.required]),
      access: new FormControl(true),
    })
    this.password = new FormControl("", [Validators.required])
    if (data.user) {
      this.changePassword = false
      data.user.rut = valSvc.formatRut(data.user.rut);
      this.userForm.setValue(data.user)
    }
    if (data.professions) {
      this.professions = data.professions;
    }
    if (data.privileges) {
      this.privileges = data.privileges;
    }
    if (data.specialization) {
      this.specializations = data.specialization;
    }
  }
  ngOnDestroy(): void {
    this.subs$.map(e => e.unsubscribe);
  }

  ngOnInit(): void {
    this.subs$.push(this.admin.getUserSelectData().subscribe(res=>{
      this.specializations = res.specializations;
      this.privileges = res.privileges;
      this.professions = res.prefessions;
    }))
    this.diaRef.updateSize('450px', 'auto');

  }
  close(): void {
    this.diaRef.close();
  }
  closeEdit(): void {
    if (this.userForm.valid) {
      if (this.changePassword && this.password.valid)
        this.userForm.addControl('password', this.password);
      const data = this.userForm.value;
      if (!this.userForm.get("idUser")?.value) {
        this.subs$.push(this.userService.addUser(data).subscribe(res => {
          if (res.data)
            this.userForm.get("idUser")?.setValue(res.data[0].idUser)
          this.diaRef.close(this.userForm.value);
        }));
      }
      else {
        this.subs$.push(this.userService.editUser(data).subscribe(res => {
          this.diaRef.close(data);
        }));
      }
    }else{
      this.userForm.markAllAsTouched()
    }
  }

  formatRut(): void {
    this.rutControl.setValue(this.valSvc.formatRut(this.rutControl.value));
  }
}
