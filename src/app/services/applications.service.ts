import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs'; // Import forkJoin and of
import { catchError, map, switchMap } from 'rxjs/operators'; // Import switchMap
import { Application } from '../models/application';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer and SafeResourceUrl

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private apiUrl = 'http://localhost:8084/api/applications';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {} // Inject DomSanitizer

  getAllApplications(): Observable<Application[]> {
    const token = localStorage.getItem('jwtToken');
    console.log('ApplicationsService: Token from localStorage', token);

    const headers = this.createAuthHeaders();
    if (!headers) {
      console.error('No token found, returning empty array');
      return of([]);
    }
    console.log('Sending request with headers:', headers);

    return this.http.get<Application[]>(this.apiUrl, { headers }).pipe(
      switchMap((applications: Application[]) => { // Use switchMap
        console.log("ApplicationsService: Applications fetched:", applications);

        if (!applications || applications.length === 0) {
          return of(applications); // Return empty array if no applications
        }

        const iconRequests: Observable<Application>[] = applications.map(application => {
          if (application.applicationIconUrl) {
            return this.getAuthorizedImage(application.applicationIconUrl, headers).pipe( // Call getAuthorizedImage
              map((blob: Blob) => {
                return this.createApplicationWithIconUrl(application, blob); // Create Application with data URL
              }),
              catchError(error => {
                console.error('Error fetching authorized image:', error);
                return of(application); // Return original application on error
              })
            );
          } else {
            return of(application); // Return original application if no icon URL
          }
        });

        return forkJoin(iconRequests); // Use forkJoin to wait for all image requests
      }),
      catchError((error) => {
        console.error('Error fetching applications:', error);
        return of([]);
      })
    );
  }

  private getAuthorizedImage(imageName: string, headers: HttpHeaders): Observable<Blob> {
    const imageUrl = `http://localhost:8084/api/images/icons/${imageName}`;
    return this.http.get(imageUrl, { headers: headers, responseType: 'blob' });
  }

  private createApplicationWithIconUrl(application: Application, imageBlob: Blob): Application {
    let reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        application.applicationIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string) as string; // Sanitize and set
      }
    };
    reader.readAsDataURL(imageBlob);
    return application; // Return the modified application object immediately
  }


  private createAuthHeaders(): HttpHeaders | undefined {
    const token = localStorage.getItem('jwtToken');
    console.log('Token retrieved:', token);
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
  }
}