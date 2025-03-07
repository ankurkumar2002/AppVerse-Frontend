import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserDataService } from '../../services/user-data.service';
import { UserResponse } from '../../models/user-response';
import { ProfileUpdateService } from '../../services/profileupdate.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit, OnDestroy {
  user: User = new User();
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  profileImageFile: File | null = null;
  profileImagePreviewUrl: any;
  private imageSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private applicationRef: ApplicationRef,
    private profileUpdateService: ProfileUpdateService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    console.log('UserComponent ngOnInit called');
    this.loadUserInfo();
    console.log("these are the details " + localStorage.getItem('userDetails'));
  }

  ngOnDestroy(): void {
    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }
  }

  loadUserInfo(): void {
    this.isLoading = true;
    console.log('loadUserInfo started, isLoading set to true');

    const userDetailsString = localStorage.getItem('userDetails');
    let username = null;

    if (userDetailsString) {
      try {
        const userDetails = JSON.parse(userDetailsString);
        username = userDetails.username;
        console.log('userDetails from localStorage:', userDetails);
      } catch (error) {
        console.error('Error parsing userDetails from localStorage:', error);
        this.errorMessage = 'Error retrieving user information.';
        this.isLoading = false;
        return;
      }
    }

    console.log('Username from userDetails:', username);

    if (username) {
      console.log('Calling userService.getUserByUsername with username:', username);
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          console.log('userService.getUserByUsername SUCCESS:', user);
          this.user = user;
          this.getProfileImageDisplayUrl();
          this.isLoading = false;
          console.log('loadUserInfo completed, isLoading set to false, user object:', this.user);
        },
        error: (error) => {
          console.error('Error fetching user info:', error);
          this.errorMessage = 'Failed to load user information.';
          this.isLoading = false;
          console.log('loadUserInfo ERROR, isLoading set to false, errorMessage:', this.errorMessage);
        }
      });
    } else {
      this.errorMessage = 'userDetails not found or username missing in localStorage.';
      this.isLoading = false;
      console.log('loadUserInfo ERROR: userDetails or username not found in localStorage, errorMessage:', this.errorMessage);
    }
  }

  updateUser(): void {
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.userService.updateUser(this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'User information updated successfully!';
        this.isLoading = false;

        // Check if a profile image file is selected, and upload it if it is.
        if (this.profileImageFile) {
          this.uploadProfileImage(updatedUser.user_id); // Pass user id to method
        } else {
          const userResponse: UserResponse = {
            username: updatedUser.username,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name || '',
            email: updatedUser.email,
            role: updatedUser.role,
            created_at: updatedUser.created_at || '',
            profileImageUrl: updatedUser.profileImageUrl
          };
          this.profileUpdateService.announceProfileUpdate(userResponse);  // Trigger profile update service
        }
          this.loadUserInfo();
          this.applicationRef.tick(); // Trigger change detection

      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = 'Failed to update user information.';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    this.profileImageFile = event.target.files[0];
    this.previewProfileImage();
  }

  previewProfileImage(): void {
    if (this.profileImageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreviewUrl = reader.result;
      }
      reader.readAsDataURL(this.profileImageFile);
    } else {
      this.getProfileImageDisplayUrl(); // Refresh display URL if file is cleared
    }
  }

  uploadProfileImage(userId: number): void {
    if (!this.profileImageFile) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.userService.uploadProfileImage(userId, this.profileImageFile).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.getProfileImageDisplayUrl();
        this.successMessage = 'Profile image uploaded successfully!';
        this.isLoading = false;
        this.profileImageFile = null;

        const userResponse: UserResponse = {
          username: updatedUser.username,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name || '',
          email: updatedUser.email,
          role: updatedUser.role,
          created_at: updatedUser.created_at || '',
          profileImageUrl: updatedUser.profileImageUrl
        };
        this.profileUpdateService.announceProfileUpdate(userResponse); // Trigger profile update service
        this.loadUserInfo();
        this.applicationRef.tick(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error uploading profile image:', error);
        this.errorMessage = 'Failed to upload profile image.';
        this.isLoading = false;
        this.profileImageFile = null;
      }
    });
  }

  getProfileImageDisplayUrl(): void {
    if (this.user.profileImageUrl) {
      this.imageSubscription = this.userService.getProfileImageBlobUrl(this.user.profileImageUrl).subscribe({
        next: (imageBlob) => {
          this.profileImagePreviewUrl = URL.createObjectURL(imageBlob);
        },
        error: (error) => {
          console.error('Error fetching profile image blob:', error);
          this.profileImagePreviewUrl = 'assets/default-profile-image.png';
        }
      });
    } else {
      this.profileImagePreviewUrl = 'assets/default-profile-image.png';
    }
  }
}