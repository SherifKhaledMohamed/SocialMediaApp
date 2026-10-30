import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly httpClient = inject(HttpClient);

  getAllComments(postId: string, limit: number = 10): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `posts/${postId}/comments?page=1&limit=${limit}`,
    );
  }

  createComment(postId: string, data: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts/${postId}/comments`, data);
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `posts/${postId}/comments/${commentId}`);
  }
  editComment(postId: string, commentId: string, data: any): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/comments/${commentId}`, data);
  }
}
