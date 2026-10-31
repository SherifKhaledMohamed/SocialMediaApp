import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsService } from '../timeline/components/posts/services/posts.service';
import { Post } from '../timeline/components/posts/interfaces/post.interface';
import { CommentComponent } from '../timeline/components/posts/components/comment/comment.component';
import { SideRightComponent } from '../timeline/components/side-right/side-right.component';

@Component({
  selector: 'app-details',
  imports: [CommentComponent, SideRightComponent, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);

  currentuserId = signal('');
  postData = signal<Post>({} as Post);
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
        this.postData.set(res.data.post);
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
