import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient)
   token = {
    headers:{
        'AUTHORIZATION':`Bearer ${localStorage.getItem('token')}`
      }
    }

  getAllPosts():Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'posts', this.token);
  }
  getSinglePost(postId:string):Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'posts/'+postId, this.token);
  }
  deletePost(postId:string):Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'posts/'+postId, this.token);
  }
  createPost(data:object):Observable<any> {
    return this.httpClient.post(environment.baseUrl + "posts",data,this.token);
  }
}
