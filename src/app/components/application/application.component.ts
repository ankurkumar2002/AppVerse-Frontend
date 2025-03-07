import { Component, OnInit } from '@angular/core';
import { Application } from '../../models/application';
import { ApplicationsService } from '../../services/applications.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule to imports
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  pagedApplications: Application[] = []; // Applications for the current page
  errorMessage: string | null = null;
  isLoading: boolean = true;

  searchQuery: string = '';
  sortField: string = 'applicationName';
  sortOrder: string = 'asc';

  currentPage: number = 1;
  pageSize: number = 6; // You can adjust page size
  totalPages: number = 1;

  constructor(private applicationsService: ApplicationsService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applicationsService.getAllApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.applyFiltersAndSorting();
        this.updatePagination();
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error fetching applications:', error);
        this.errorMessage = 'Failed to fetch applications.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page on search
    this.applyFiltersAndSorting();
    this.updatePagination();
  }

  onSort(): void {
    this.applyFiltersAndSorting();
    this.updatePagination();
  }

  applyFiltersAndSorting(): void {
    this.filteredApplications = this.applications.filter(app => {
      const searchStr = (app.applicationName + ' ' + app.description + ' ' + (app.category?.categoryName || '')).toLowerCase();
      return searchStr.includes(this.searchQuery.toLowerCase());
    });

    this.filteredApplications.sort((a, b) => {
      let comparison = 0;
      const aValue = this.getSortValue(a, this.sortField);
      const bValue = this.getSortValue(b, this.sortField);

      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      return this.sortOrder === 'desc' ? comparison * -1 : comparison;
    });
  }

  getSortValue(application: Application, field: string): any {
    if (field.includes('.')) { // Handle nested properties (e.g., category.categoryName)
      const parts = field.split('.');
      let value: any = application;
      for (const part of parts) {
        value = value?.[part];
      }
      return value;
    }
    return application[field as keyof Application];
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredApplications.length / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages; // Prevent currentPage from being out of range
    } else if (this.totalPages === 0) {
      this.currentPage = 1; // Reset to page 1 if no applications
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedApplications = this.filteredApplications.slice(startIndex, endIndex);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // **New Method Added to Component Logic**
  goToApplicationUrl(url: string): void {
    if (url) {
      window.open(url, '_blank'); // Opens URL in a new tab/window
    }
  }
}