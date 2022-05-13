import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Features, Speciality } from '../../features/users-management/models/privilege';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';

@Directive({
  selector: '[appSpeciality]'
})
export class SpecialityDirective {

  @Input() appSpeciality!: Speciality;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private el: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    const userSpec =this.auth.getSpeciality();
    if (userSpec === Speciality.ALL || this.appSpeciality === userSpec) {
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
