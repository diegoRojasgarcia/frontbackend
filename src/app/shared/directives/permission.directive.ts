import { Directive, ElementRef, Injectable, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Permission, Features } from '../../features/users-management/models/privilege';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';

@Directive({
  selector: '[appPermission]',
})
export class PermissionDirective {

  @Input() appPermission!: Permission[];
  @Input() appPermissionFeature!: Features;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private el: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    if (this.appPermission.includes(this.auth.checkPermission(this.appPermissionFeature))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

}
