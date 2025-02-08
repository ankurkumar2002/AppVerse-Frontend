import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule]
})
export class HomeComponent {
  subscribedAppsCount: number = 5; // Example count, replace with actual data
  recentActivityCount: number = 10; // Example count, replace with actual data
  searchResults: { name: string, link: string }[] = [];
  allOptions = [
    { name: 'Edit Profile', link: '/edit-profile' },
    { name: 'Change Password', link: '/change-password' },
    { name: 'Forgot Password', link: '/forgot-password' },
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Components', link: '/components' },
    // Add more options as needed
  ];
  users: User[] = [];
  errorMessage: string | null = null;

  constructor(private authService: AuthService , private router:Router) {
    this.fetchUsers();
    console.log(localStorage.getItem('userDetails'));
  }

  fetchUsers() {
    this.authService.getAllUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error fetching users', error);
        this.errorMessage = 'Error fetching users. Please try again later.';
      }
    );
  }
  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchResults = this.allOptions.filter(option => option.name.toLowerCase().includes(query));
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
    this.searchResults = []; // Clear search results after navigation
  }
}
