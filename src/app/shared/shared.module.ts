import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './components/title/title.component';
import { PermissionDirective } from './directives/permission.directive';
import { SpecialityDirective } from './directives/speciality.directive';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { MATERIALS } from '.';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    TitleComponent,
    PermissionDirective,
    SpecialityDirective,
    EditUserComponent,
    ConfirmDialogComponent,
    LoadingComponent
    
  ],
  imports: [
    CommonModule,
    MATERIALS
  ],
  exports:[
    TitleComponent,
    PermissionDirective,
    SpecialityDirective,
    EditUserComponent,
    MATERIALS
  ],
})
export class SharedModule { }
