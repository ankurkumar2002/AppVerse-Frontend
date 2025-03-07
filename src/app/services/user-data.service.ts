// user-data.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Import PLATFORM_ID and Inject
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { BehaviorSubject } from 'rxjs';
import { UserResponse } from '../models/user-response'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userDataSource = new BehaviorSubject<UserResponse | null>(null);
  currentUserData$ = this.userDataSource.asObservable();
  private isBrowser: boolean; // Flag to check if running in browser

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { // Inject PLATFORM_ID
    this.isBrowser = isPlatformBrowser(this.platformId); // Determine if in browser
    // Initialization from localStorage is moved out of constructor
    // It will now be handled lazily or in a component
  }

  // Method to initialize user data from localStorage (call from a component's ngOnInit)
  initializeUserData(): void {
    if (this.isBrowser) { // Only access localStorage if in browser
      const storedUserDetails = localStorage.getItem('userDetails');
      if (storedUserDetails) {
        this.setUser(JSON.parse(storedUserDetails) as UserResponse);
      }
    }
  }


  setUser(user: UserResponse): void {
    this.userDataSource.next(user);
    if (this.isBrowser) { // Only access localStorage if in browser
      localStorage.setItem('userDetails', JSON.stringify(user)); // Update localStorage on setUser
    }
  }

  getCurrentUser(): UserResponse | null {
    return this.userDataSource.value;
  }

  clearUser(): void {
    this.userDataSource.next(null);
    if (this.isBrowser) { // Only access localStorage if in browser
      localStorage.removeItem('userDetails'); // Clear localStorage on clearUser
    }
  }
}