import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Router, RouterModule } from '@angular/router'; //Import router module for routing
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Application } from '../../models/application';
import { ApplicationsService } from '../../services/applications.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FormsModule, RouterModule] //Added routermodule for routing
})
export class HomeComponent implements OnInit {
  subscribedAppsCount: number = 5;
  recentActivityCount: number = 10;

  // **Combined Search Properties**
  searchResults: any[] = [];
  applications: Application[] = [];

  allOptions = [
    { name: 'Edit Profile', link: '/user', type: 'component' },  //Type specifies what it is
    { name: 'Change Password', link: '/change-password', type: 'component' },
    { name: 'Forgot Password', link: '/forgot-password', type: 'component' },
    { name: 'Dashboard', link: '/home', type: 'component' },
    { name: 'Components', link: '/components', type: 'component' },
    // Add more options as needed
  ];

  recentActivities: { description: string; timestamp: Date }[] = [
    { description: 'User logged in', timestamp: new Date() },
    { description: 'Profile updated', timestamp: new Date(Date.now() - 3600000) }, // 1 hour ago
    { description: 'Subscribed to AppX', timestamp: new Date(Date.now() - 86400000) } // 1 day ago
    // Add more activities as needed
  ];

  users: User[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = false;  //To handle loading operation

  searchQuery: string = '';

  constructor(private authService: AuthService, private router: Router, private applicationsService: ApplicationsService) {
    this.fetchUsers();
  }

  ngOnInit(): void {

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

  onSearch(event?: any): void {
    if (event) {
      const query = event.target.value.toLowerCase();
      this.searchQuery = query;

    }

    //If query is emtpy, clear.
    if (this.searchQuery == '') {
      this.searchResults = []; // Clear previous results
      return;
    }

    this.searchResults = []; // Clear previous results
    this.searchComponents(this.searchQuery); // Search components as well
    this.searchApplications(this.searchQuery);

  }

  //Separate Functions to search applications and components so that can be combined effectively.
  searchComponents(query: string) {
    const componentResults = this.allOptions.filter(option => option.name.toLowerCase().includes(query));
    this.searchResults.push(...componentResults);
  }
  searchApplications(query: string) {
    //Only load application if one is actually searching
    if (!this.isLoading) {
      this.isLoading = true;
      this.applicationsService.getAllApplications().subscribe({
        next: (applications) => {
          this.applications = applications;
          const appResults = this.applications.filter(app => (app.applicationName + ' ' + app.description).toLowerCase().includes(query));
          //Append the application image url
          const appResultsWithIcons = appResults.map(app => ({
            ...app,
            iconUrl: app.applicationIconUrl //Adding image
          }))
          this.searchResults.push(...appResultsWithIcons);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching applications:', error);
          this.errorMessage = 'Failed to fetch applications.';
          this.isLoading = false;
        }
      });
    }
  }


  navigateTo(result: any): void {
    //Check the type for action
    if (result.type === 'component') {
      this.router.navigate([result.link]);
    } else if (result.applicationUrl) {
      //If it is application, then open a new url
      window.open(result.applicationUrl, '_blank'); // Opens URL in a new tab/window
    }

    this.searchResults = []; // Clear search results after navigation
  }


}