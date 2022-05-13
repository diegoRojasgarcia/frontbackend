import { Component, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Speciality } from 'src/app/features/users-management/models/privilege';
import { UsersService } from 'src/app/features/users-management/services/users/users.service';
import { EditUserComponent } from 'src/app/shared/components/edit-user/edit-user.component';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  private subs$ = new Subscription()
  @ViewChild('sidenav')
  sidenav!: MatDrawer;
  SPECIALITIES = Speciality
  navStyle = 'sidenav-container';

  constructor(private router: Router, private profileDialog: MatDialog, private authService: AuthenticationService, private usersService: UsersService) { }
  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }


  openSidenav(): void {
    this.navStyle = 'sidenav-container-opened';
    this.sidenav.open()
  }

  closeSidenav(): void {
    this.sidenav.close()
    this.navStyle = 'sidenav-container';
  }

  toUsersAdministration(): void {
    this.router.navigate(["users"]);
    this.closeSidenav();
  }
  toHome(): void {
    this.router.navigate(["/"]);
    this.closeSidenav();
  }

  toCBP(): void {
    this.router.navigate(["bronchopulmonary"]);
    this.closeSidenav();
  }

  toCCR(): void {
    this.router.navigate(["colon-rectal"]);
    this.closeSidenav();
  }

  seeUserProfile(): void {
    const dialogConfig = new MatDialogConfig();
    let data;
    if (this.authService.isLoggedIn())
      this.subs$.add(this.usersService.getUser(this.authService.getUserId()).subscribe((res) => {
        data = res.data;
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          title: "Perfil de Usuario",
          user: data[0]
        }
        this.profileDialog.open(EditUserComponent, dialogConfig);

      }));
  }
  logOut(): void {
    this.authService.logout();
  }
}

