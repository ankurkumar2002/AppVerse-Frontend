import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../models/user-response';
import { NgbDropdownModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { Subscription, tap } from 'rxjs';
import { ProfileUpdateService } from '../../services/profileupdate.service';
import { UserDataService } from '../../services/user-data.service'; // Import

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, NgbScrollSpyModule, NgbDropdownModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, OnDestroy {
  private profileUpdateSubscription?: Subscription;
  currentRoute: string = '';
  isLoggedIn: boolean | null = null; // Use null for loading state
  isLoading: boolean = true; // Add isLoading flag
  loggedInUser: UserResponse | null = null;
  profileImageUrlDataUrl: string | null = null;
  authSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    public userService: UserService,
    private profileUpdateService: ProfileUpdateService,
    private cdr: ChangeDetectorRef,
    private userDataService: UserDataService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.cdr.detectChanges(); //Manually trigger change detection
      }
    });
  }

  ngOnInit(): void {
    this.userDataService.initializeUserData();

    this.userDataService.currentUserData$.subscribe(user => {
      this.loggedInUser = user;
      if (user) {
        this.loadProfileImage();
      } else {
        this.profileImageUrlDataUrl = null;
      }
      this.cdr.detectChanges();
    });

    // Perform the authentication check and set isLoading to false when complete
    this.authSubscription = this.authService.isLoggedIn()
      .pipe(
        tap(LoggedIn => {
          this.isLoggedIn = LoggedIn;
          if (LoggedIn && this.loggedInUser?.profileImageUrl) {
            this.loadProfileImage();
          } else {
            this.profileImageUrlDataUrl = null;
          }
          this.isLoading = false; // Set isLoading to false after auth check
          this.cdr.detectChanges();
        })
      )
      .subscribe();

    this.profileUpdateSubscription = this.profileUpdateService.profileUpdated$.pipe(
      tap((updatedUser) => {
        this.loggedInUser = updatedUser;
      })
    ).subscribe(() => {
      this.loadProfileImage();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.profileUpdateSubscription) {
      this.profileUpdateSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  loadProfileImage(): void {
    if (this.loggedInUser?.profileImageUrl) {
      this.userService.getProfileImageBlob(this.loggedInUser.profileImageUrl).subscribe(blob => {
        this.createImageFromBlob(blob);
      });
    } else {
      this.profileImageUrlDataUrl = null;
    }
  }

  createImageFromBlob(imageBlob: Blob): void {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.profileImageUrlDataUrl = reader.result as string;
    }, false);

    if (imageBlob) {
      reader.readAsDataURL(imageBlob);
    }
  }
}