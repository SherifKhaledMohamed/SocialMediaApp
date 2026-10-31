import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'users/signup', data);
  }
  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'users/signin', data);
  }
  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  getSuggestedFriends(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'users/suggestions');
  }
  followUser(userId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `users/${userId}/follow`, null);
  }
  changePassword(data: object): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `users/change-password`, data);
  }
  getProfile(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'users/profile-data');
  }
  uploadCover(data: FormData): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/upload-cover', data);
  }
  deleteCover(): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'users/cover');
  }
  updateProfileImage(data: FormData): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/upload-photo', data);
  }
  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/${userId}/posts`);
  }
}
