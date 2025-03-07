import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserResponse } from '../models/user-response';
import { UserDataService } from './user-data.service'; // Import UserDataService

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdateService {
  private profileUpdatedSource = new Subject<UserResponse>();
  profileUpdated$ = this.profileUpdatedSource.asObservable();

  constructor(private userDataService: UserDataService) {} // Inject UserDataService

  announceProfileUpdate(user: UserResponse) {
    console.log("ProfileUpdateService.announceProfileUpdate - Announcing profile update:", user); //debugging
    this.userDataService.setUser(user); // Update UserDataService and localStorage

    // You can add local storage update if UserDataService doesn't already do it.
    localStorage.setItem('userDetails', JSON.stringify(user));

    this.profileUpdatedSource.next(user);
  }
}