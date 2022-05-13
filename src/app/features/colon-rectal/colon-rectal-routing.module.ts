import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCRMainComponent } from 'src/app/features/colon-rectal/pages/ccr-main/ccr-main.component';

const routes: Routes = [
  { path: '', component: CCRMainComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColonRectalRoutingModule { }

