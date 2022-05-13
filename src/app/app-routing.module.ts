import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessGuard } from './core/guards/access.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { SpecialityGuard } from './core/guards/speciality.guard';
import { Features, Speciality } from './features/users-management/models/privilege';
import { LoginComponent } from './core/components/login/login.component';
import { LoggedInLayoutComponent } from './core/components/logged-in-layout/logged-in-layout.component';
import { LoginLayoutComponent } from './core/components/login-layout/login-layout.component';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: '', component: LoggedInLayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', component: MainMenuComponent, },
      { path: 'users', loadChildren: () => import('./features/users-management/users-management.module').then(m => m.UsersManagementModule), data: { feature: Features.USER_MANAGEMENT }, canLoad: [AccessGuard] },
      { path: 'colon-rectal', loadChildren: () => import('./features/colon-rectal/colon-rectal.module').then(m => m.ColonRectalModule), data: { speciality: Speciality.CCR }, canLoad: [SpecialityGuard] },
      { path: 'bronchopulmonary', loadChildren: () => import('./features/bronchopulmonary/bronchopulmonary.module').then(m => m.BronchopulmonaryModule), data: { speciality: Speciality.CBP }, canLoad: [SpecialityGuard] },
    ]
  },
  {
    path: '', component: LoginLayoutComponent, children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: '**', component: LoggedInLayoutComponent, canActivate: [AuthGuard], children: [{ path: '**', component: PageNotFoundComponent }] },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [
    RouterModule]
})
export class AppRoutingModule { }
