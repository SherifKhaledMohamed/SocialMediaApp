import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsService } from '../timeline/components/posts/services/posts.service';
import { Post } from '../timeline/components/posts/interfaces/post.interface';
import { CommentComponent } from '../timeline/components/posts/components/comment/comment.component';
import { SideRightComponent } from '../timeline/components/side-right/side-right.component';
import { share } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ElapsedDatePipe } from '../../shared/pipes/elapsed-date-pipe';

@Component({
  selector: 'app-details',
  imports: [CommentComponent, SideRightComponent, RouterLink,ElapsedDatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);

  currentuserId = signal('');
  postData = signal<Post>({} as Post);


  sharedPostData = signal<Post>({} as Post);

  currentPostId = signal<string>('');
  ngOnInit(): void {
    this.currentuserId.set(JSON.parse(localStorage.getItem('user')!)._id);
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id')!;
      this.currentPostId.set(id);
      this.getSinglePost(id);
    });
  }

  getSinglePost(postId: string) {
    this.postsService.getSinglePost(postId).subscribe({
      next: (res) => {
        const post:Post = res.data.post;
        this.postData.set(post);

        if (post.isShare && post.sharedPost._id) {
        this.postsService.getSinglePost(post.sharedPost._id).subscribe({
          next: (sharedRes) => {
            this.sharedPostData.set(sharedRes.data.post);
          }
        });
      } else {
        this.sharedPostData.set({} as Post);
      }
      },
    });
  }
  
  


  switchBookmark(): void {
    this.postsService.switchBookmark(this.postData()._id).subscribe({
      next: (res) => {
        this.getSinglePost(this.postData()._id);
      },
    });
  }

  switchLike(): void {
    this.postsService.switchLike(this.postData()._id).subscribe({
      next: (res) => {
        this.getSinglePost(this.postData()._id);
      },
    });
  }
}
