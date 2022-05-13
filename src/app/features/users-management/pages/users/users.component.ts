import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { AdministrativeService } from 'src/app/core/services/administrative/administrative.service';
import { ValidationService } from 'src/app/core/services/validation/validation.service';
import { Privilege } from 'src/app/features/users-management/models/privilege';
import { Profession } from 'src/app/features/users-management/models/profession';
import { UserModel } from 'src/app/features/users-management/models/user.model';
import { UsersService } from 'src/app/features/users-management/services/users/users.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditUserComponent } from '../../../../shared/components/edit-user/edit-user.component';
import { Specialization } from '../../models/specialization';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements AfterViewInit, OnDestroy {

  private subs$ = new Subscription();

  displayedColumns: string[] = ['rut', 'name', 'foundation', 'profession', 'edit', 'delete'];
  dataSource!: MatTableDataSource<UserModel>;
  professions: Profession[] = [];
  specializations: Specialization[] = [];
  privileges: Privilege[] = [];
  @Input() value: string = "";

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild(MatTable)
  table!: MatTable<UserModel>;

  NO_TABLE_DATA = AppConstants.NO_TABLE_DATA;


  constructor(private dialog: MatDialog, private usersService: UsersService, private admin: AdministrativeService, private valSvc: ValidationService) { }

  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }

  // Ater init life-cycle logic
  ngAfterViewInit() {
    this.subs$.add(this.admin.getUserSelectData().subscribe(res => {
      this.professions = res.prefessions
      this.specializations = res.specializations
      this.privileges = res.privileges
    }))
    this.subs$.add(this.usersService.getUsers().pipe(map(res => {
      return res.data.map<UserModel>(e => {
        e.rut = this.valSvc.formatRut(e.rut);
        return e;
      })
    })).subscribe(
      res => {
        this.dataSource = new MatTableDataSource<UserModel>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err=>{
        this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR;
        const data: UserModel[] = []
        this.dataSource = new MatTableDataSource(data);
      }
    ));
  }

  //search on data table function 
  search(): void {
    this.dataSource.filter = this.value.trim().toLowerCase();
  }

  resetSearch(): void {
    this.value = ""
    this.search();
  }

  //reset search input
  addUser() {
    const dialogConfig = this.setDialogData("Nuevo Usuario")
    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
    this.subs$.add(dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataRef = this.dataSource.data;
        dataRef.unshift(res);
        this.dataSource.data = dataRef;
        this.dataSource.paginator?.firstPage();
      }
    }))
  }

  editUser(row: UserModel) {
    delete row.password
    const dialogConfig = this.setDialogData("Editar Usuario", row);
    const diaRef = this.dialog.open(EditUserComponent, dialogConfig);
    this.subs$.add(diaRef.afterClosed().subscribe(res => {
      if (res) {
        const dataRef = this.dataSource.data.filter(user => {
          return user.idUser != res.idUser;
        })
        res.rut = this.valSvc.formatRut(res.rut);
        dataRef.unshift(res);
        this.dataSource.data = dataRef;
        this.dataSource.paginator?.firstPage();
      }

    }))
  }

  updateUserAccess(row: UserModel): void {
    const dialogConfig = new MatDialogConfig();
    let action = ""
    const value = row.access;
    const rowRef = { ...row };
    if (value)
      action = "Bloquear";
    else
      action = "Desbloquear"

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: action + " Usuario",
      action: action,
      msg: "¿Seguro que desea " + action + " del sistema a " + row.name + "?"
    }
    const diaRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res.response) {
        row.access = undefined;
        rowRef.access = !value;
        return this.usersService.editUser(rowRef, false)
      } else
        return new Observable<true>()
    })).subscribe(res => row.access = !value, err=> row.access = value))
  }

  setDialogData(title: string, user?: UserModel): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      user: user,
      professions: this.professions,
      privileges: this.privileges,
      specialization: this.specializations
    }
    return dialogConfig;
  }

  searchProfession(id: number): string | undefined {
    return this.professions.find(profession => profession.idProfession == id)?.name;
  }
}
