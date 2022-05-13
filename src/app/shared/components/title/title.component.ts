import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {

  @Input() pageTitle: string = 'Sin título'
  @Input() pageSubtitle: string | undefined = undefined

  constructor() { }
}
