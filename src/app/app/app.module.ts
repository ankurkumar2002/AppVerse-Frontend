import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // <-- ADD BrowserModule
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../interceptor/auth.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { RouterModule } from '@angular/router'; // <-- ADD RouterModule and import from '@angular/router'
import { routes } from '../app.routes';
import { NavbarComponent } from '../components/navbar/navbar.component'; // <-- ADD import for NavbarComponent
import { SignupComponent } from '../components/signup/signup.component'; // <-- ADD import for SignupComponent
import { HomeComponent } from '../components/home/home.component'; // <-- ADD import for HomeComponent
import { LogoutComponent } from '../components/logout/logout.component'; // <-- ADD import for LogoutComponent


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent, // <-- ADD NavbarComponent to declarations
    SignupComponent, // <-- ADD SignupComponent to declarations
    HomeComponent,   // <-- ADD HomeComponent to declarations
    LogoutComponent  // <-- ADD LogoutComponent to declarations
  ],
  imports: [
    BrowserModule, // <-- ADD BrowserModule to imports
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(routes) // <-- ADD RouterModule.forRoot(routes) to imports
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent] // <-- Make sure bootstrap is present (if it wasn't already)
})
export class AppModule { }