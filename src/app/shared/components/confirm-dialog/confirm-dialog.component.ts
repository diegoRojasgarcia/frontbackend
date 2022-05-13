import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  action: string;
  msg: string;
  title: string;
  action2:string;
  constructor(private diaRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) data: ConfirmDialogData) {
    this.action = data.action;
    this.msg = data.msg;
    this.title = data.title;
    this.action2 = data.action2??'Cancelar'
  }

  ngOnInit(): void {
  }
  cancel(): void {
    this.diaRef.close({ response: false })
  }
  confirm(): void {
    this.diaRef.close({ response: true })
  }
}
export interface ConfirmDialogData {
  action: string;
  msg: string;
  title: string;
  action2?: string;
}