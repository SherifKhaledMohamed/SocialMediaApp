import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'posts');
  }
  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'posts/' + postId);
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'posts/' + postId);
  }
  createPost(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'posts', data);
  }
  editPost(postId: string, data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}`, data);
  }
  switchBookmark(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/bookmark`, null);
  }
  switchLike(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/like`, null);
  }
  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/${userId}/posts`);
  }
  getBookmarks(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'users/bookmarks');
  }
  getHomeFeed(only:string='following',limit:number = 10): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/feed?only=${only}&limit=${limit}`)
  }
}
