import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";

import { AppComponent } from './app.component';
import { LoginComponent } from './core/components/login/login.component';


import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './core/interceptors/auth-interceptor/auth-interceptor.interceptor';
import { ErrorInterceptor } from './core/interceptors/error-interceptor/error.interceptor';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { LoggedInLayoutComponent } from './core/components/logged-in-layout/logged-in-layout.component';
import { LoginLayoutComponent } from './core/components/login-layout/login-layout.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { SharedModule } from './shared/shared.module';
import { load } from './core/utils/init-load';
import { OverlayModule } from '@angular/cdk/overlay';
import { OverlayInterceptor } from './core/interceptors/overlay/overlay.interceptor';

import { MatTableExporterModule } from 'mat-table-exporter';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatButtonModule } from '@angular/material/button';

import { NgChartsModule } from 'ng2-charts';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    MainMenuComponent,
    PageNotFoundComponent,
    LoginLayoutComponent,
    LoggedInLayoutComponent,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    SharedModule,
    OverlayModule,
    MatTableExporterModule,
    MatMenuModule,
    MatButtonModule,
    NgChartsModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: load, multi: true, deps: [HttpClient, AuthenticationService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: OverlayInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ErrorInterceptor },
    MatDatepickerModule, MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
