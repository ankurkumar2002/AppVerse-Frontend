import { Component, NgModule, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../models/user-response';
import { NgbDropdownModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, NgbScrollSpyModule, NgbDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
    currentRoute : string = '';
    isLoggedIn: boolean = false;
    userDetails: UserResponse | null = null;

  constructor(private router: Router, private authService:AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }
  ngOnInit(): void {
    const   storedUserDetails = localStorage.getItem('userDetails');
    this.isLoggedIn = !!storedUserDetails;
    if (storedUserDetails) {
      this.userDetails = JSON.parse(storedUserDetails) as UserResponse;
    }
    this.authService.isLoggedIn().subscribe(LoggedIn => {
      this.isLoggedIn = LoggedIn
    })
  }

  logout(): void {
    this.authService.logout();
  }
}
