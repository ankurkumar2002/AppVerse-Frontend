import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError, map } from 'rxjs';
import { User } from '../models/user';
import { UserDataService } from './user-data.service';
import { UserResponse } from '../models/user-response';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private userDataService: UserDataService) { }

    private apiUrl = 'http://localhost:8060/'; // Adjust if needed

    private createAuthHeaders(): HttpHeaders | undefined {
        const token = localStorage.getItem('jwtToken');
        console.log('UserService - Token retrieved for image fetch:', token);
        return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    }

    uploadProfileImage(userId: number, image: File): Observable<User> {
        const headers = this.createAuthHeaders();
        const formData: FormData = new FormData();
        formData.append('userId', String(userId));
        formData.append('image', image, image.name);
        const imageUploadHeaders = headers;

        return this.http.post<User>(`${this.apiUrl}auth/profile-image`, formData, { headers: imageUploadHeaders, observe: 'response' }).pipe(
            tap((response: HttpResponse<User>) => {
                const updatedUser = response.body as User;
                const newToken = response.headers.get('Authorization');
                if (newToken) {
                    localStorage.setItem('jwtToken', newToken.replace('Bearer ', ''));
                    console.log('UserService.uploadProfileImage - New JWT Token updated in localStorage:', newToken);
                }
                console.log('UserService.uploadProfileImage - Success, updatedUser:', updatedUser);
                this.updateUserDataAndLocalStorage(updatedUser);  // ***Important:  Call this here***
            }),
            map((response: HttpResponse<User>) => response.body as User),
            catchError(this.handleError)
        );
    }

    updateUser(user: User): Observable<User> {
        const headers = this.createAuthHeaders();
        return this.http.put<User>(`${this.apiUrl}auth/edit`, user, { headers, observe: 'response' })
            .pipe(
                tap((response: HttpResponse<User>) => {
                    const updatedUser = response.body as User;
                    const newToken = response.headers.get('Authorization');
                    if (newToken) {
                        localStorage.setItem('jwtToken', newToken.replace('Bearer ', ''));
                        console.log('UserService.updateUser - New JWT Token updated in localStorage:', newToken);
                    }
                    console.log('UserService.updateUser - Success, updatedUser:', updatedUser);
                    this.updateUserDataAndLocalStorage(updatedUser);
                }),
                map((response: HttpResponse<User>) => response.body as User),
                catchError(this.handleError)
            );
    }

    getUserByUsername(username: string): Observable<User> {
        const headers = this.createAuthHeaders();
        return this.http.get<User>(`${this.apiUrl}auth/get-user-info`, { headers, params: { username } }).pipe(
            tap(user => {
                this.updateUserDataAndLocalStorage(user);
            }),
            catchError(this.handleError)
        );
    }

    getProfileImageBlob(imagePath: string | undefined): Observable<Blob> {
        const headers = this.createAuthHeaders();
        if (imagePath) {
            const imageUrl = `${this.apiUrl}auth/profile-image?imagePath=${encodeURIComponent(imagePath)}`;
            console.log('UserService - Fetching image with URL:', imageUrl);
            return this.http.get(imageUrl, { headers: headers, responseType: 'blob' });
        } else {
            return of(new Blob());
        }
    }

    getProfileImageUrl(imagePath: string): string {
        console.log("fetching image URL string for path: " + imagePath);
        return `${this.apiUrl}auth/profile-image?imagePath=${encodeURIComponent(imagePath)}`;
    }

    getProfileImageBlobUrl(imagePath: string): Observable<Blob> {
        const headers = this.createAuthHeaders();
        const imageUrl = `${this.apiUrl}auth/profile-image?imagePath=${encodeURIComponent(imagePath)}`;
        console.log("Fetching image blob with headers for updation: " + imagePath);
        return this.http.get(imageUrl, { headers: headers, responseType: 'blob' }).pipe(
            catchError(this.handleError)
        );
    }

    getImageUrl(profileImageUrl: string | undefined): string {
        if (profileImageUrl) {
            return `${this.apiUrl}users/profile-image?imagePath=${encodeURIComponent(profileImageUrl)}`;
        }
        return '';
    }

    private handleError(error: any) {
        console.error('UserService Error:', error);
        let errorMessage = 'Something went wrong; please try again later.';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else if (error.status) {
            errorMessage = `Error Code: ${error.status},  Message: ${error.error?.message || error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }

    private updateUserDataAndLocalStorage(updatedUser: User): void {
        // Convert User to UserResponse
        const userResponse: UserResponse = {
            username: updatedUser.username,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name || '',
            email: updatedUser.email,
            role: updatedUser.role,
            created_at: updatedUser.created_at || '',
            profileImageUrl: updatedUser.profileImageUrl
        };
        this.userDataService.setUser(userResponse);
        localStorage.setItem('userDetails', JSON.stringify(userResponse));
    }
}