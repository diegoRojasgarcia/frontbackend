import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent  {

  name:any="desconocido";
  
  constructor(private authService:AuthenticationService, private _snackBar: MatSnackBar ) { }


  openSnackBar(message: string):void {
    this._snackBar.open(message, "close");
  }

}
