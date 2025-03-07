import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './authguard/auth.guard';
import { loggedinGuard } from './authguard/loggedin.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { ApplicationComponent } from './components/application/application.component';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [loggedinGuard] },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [loggedinGuard] },
    { path: 'logout', component: LogoutComponent, canActivate: [authGuard]},    
    { path: 'application', component: ApplicationComponent, canActivate: [authGuard]},
    { path: 'user', component: UserComponent, canActivate: [authGuard]},
];
