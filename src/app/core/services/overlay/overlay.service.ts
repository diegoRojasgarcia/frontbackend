import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  overlayRef!: OverlayRef;
  constructor(private overlay: Overlay) {}
  open() {
      // We create the overlay
      this.overlayRef = this.createOverlay();
      //Then we create a portal to render a component
      const componentPortal = new ComponentPortal(LoadingComponent);
      //We render the portal in the overlay
      this.overlayRef.attach(componentPortal);
  }
  close(): void {
    this.overlayRef.dispose()
  }

  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return this.overlay.create(overlayConfig);
  }


}
