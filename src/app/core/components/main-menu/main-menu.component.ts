import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsersService } from 'src/app/features/users-management/services/users/users.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { Features, Permission, Speciality } from 'src/app/features/users-management/models/privilege';
import { EditUserComponent } from 'src/app/shared/components/edit-user/edit-user.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  private sub$ = new Subscription();

  CBP = AppConstants.CBP_NAME;
  CCR = AppConstants.CCR_NAME;
  PERMISSIONS = Permission;
  FEATURES = Features;
  SPECIALITIES = Speciality;

  // @ViewChild('grid') grid: MatGridList;
  cols = 2;
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private profileDialog: MatDialog,
    private authService: AuthenticationService, private usersService: UsersService) {

    this.sub$.add(this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      }
    }));
  }
  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  ngOnInit(): void {
  }
  toUsersAdministration(): void {
    this.router.navigate(["users"]);
  }
  seeUserProfile(): void {
    const dialogConfig = new MatDialogConfig();
    let data;
    if (this.authService.isLoggedIn())
      this.sub$.add(this.usersService.getUser(this.authService.getUserId()).subscribe((res) => {
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
  toCCR(): void {
    this.router.navigate(['colon-rectal']);
  }
  toCBP(): void {
    this.router.navigate(['bronchopulmonary'])
  }
}
