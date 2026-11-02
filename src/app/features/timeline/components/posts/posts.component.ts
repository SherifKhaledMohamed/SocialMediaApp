import { AuthService } from './../../../../core/auth/services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post, User } from './interfaces/post.interface';
import { PostsService } from './services/posts.service';
import { Component, inject, signal, input, computed, OnChanges} from '@angular/core';
import { CommentComponent } from './components/comment/comment.component';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-posts',
  imports: [ReactiveFormsModule, CommentComponent, RouterLink,DatePipe],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnChanges {
  private readonly postsService = inject(PostsService);
  private readonly toastrService = inject(ToastrService);
  private readonly authService = inject(AuthService);
  type = input('');
  allPosts = signal<Post[]>([]);
  currentuser = signal<User>(JSON.parse(localStorage.getItem('user')!) as User);
  currentuserId = signal(this.currentuser()._id);

  imgFile = signal<File | null>(null);
  imgSrc = signal('');

  postBody = new FormControl('', [Validators.required]);
  postPrivacy = new FormControl('public');
  isUpdating = signal<boolean>(false);
  loadComments = signal<boolean>(false);
  currentPost = signal<Post | null>(null);
  homeFeedPosts = signal<Post[]>([]);
  userPosts = signal<Post[]>([]);
  bookmarkPosts = signal<Post[]>([]);



  ngOnChanges(): void {
    this.getPostsData();
  }


  postsToPreview = computed(() => {
    switch (this.type()) {
      case 'saved':
        return this.bookmarkPosts();
      case 'myposts':
        return this.userPosts();
      case 'feed':
        return this.homeFeedPosts();
      default:
        return this.allPosts();
    }
  });

  getPostsData(): void {
    switch (this.type()) {
      case 'saved':
        this.getBookmarks();
        break;
      case 'myposts':
        this.getUserPosts(this.currentuserId());
        break;
      case 'feed':
        this.getHomeFeedData();
        break;
      default:
        this.postsService.getAllPosts().subscribe({
          next: (res) => this.allPosts.set(res.data.posts),
        });
    }
  }

  changePhoto(e: Event) {
    let input = e.target as HTMLInputElement;

    if (input.files) {
      this.imgFile.set(input.files[0]);
      this.imgSrc.set(URL.createObjectURL(input.files[0]));
    }
  }

  editOrSubmitPost(e: SubmitEvent, input: HTMLInputElement) {
    if (this.isUpdating()) {
      this.editPost(input, e);
    } else {
      this.submitPost(e);
    }
    this.isUpdating.set(false);
  }

  submitPost(e: SubmitEvent) {
    e.preventDefault();
    let formData = new FormData();
    if (this.postBody.value) {
      formData.append('body', this.postBody.value);
    }
    if (this.postPrivacy.value) {
      formData.append('privacy', this.postPrivacy.value);
    }
    if (this.imgFile()) {
      formData.append('image', this.imgFile()!);
    }

    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        this.getPostsData();
      },
      complete: () => {
        (e.target as HTMLFormElement).reset();

        this.imgSrc.set('');
        this.toastrService.success('Post Created Succesfully!', 'Aura Space');
      },
    });
  }

  editPost(input: HTMLInputElement, e: SubmitEvent): void {
    e.preventDefault();

    let formData = new FormData();

    if (this.postBody.value) {
      formData.append('body', this.postBody.value);
    }
    formData.append('privacy', this.postPrivacy.value!);

    if (input.files) {
      if (input.files[0]) {
        this.imgSrc.set(URL.createObjectURL(input.files[0]));

        this.imgFile.set(input.files[0]);

        formData.append('image', this.imgFile()!);
      }
    } else if (this.imgSrc() !== '') {
      formData.append('image', this.imgSrc());
    }

    this.postsService.editPost(this.currentPost()?._id!, formData).subscribe({
      next: (res) => {
        this.getPostsData();
      },

      complete: () => {
        (e.target as HTMLFormElement).reset();

        this.imgSrc.set('');
        this.toastrService.success('Post Updated Succesfully!', 'Aura Space');
      },
    });
  }

  setPostData(post: Post) {
    this.postBody.setValue(this.currentPost()?.body!);
    this.postPrivacy.setValue(this.currentPost()?.privacy!);
    if (this.currentPost()?.image) {
      this.imgSrc.set(this.currentPost()?.image!);
    }
  }

  isUpdatingPost(post: Post): void {
    this.isUpdating.set(true);

    this.currentPost.set(post);

    this.setPostData(post);
  }

  deletePostData(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        this.getPostsData();
      },
      complete: () => {
        this.toastrService.success('Post Deleted Succesfully!', 'Aura Space');
      },
    });
  }

  switchBookmark(postId: string): void {
    this.postsService.switchBookmark(postId).subscribe({
      next: (res) => {
        this.getPostsData();
      },
    });
  }
  switchLike(postId: string): void {
    this.postsService.switchLike(postId).subscribe({
      next: (res) => {
        this.getPostsData();
      },
    });
  }

  getHomeFeedData(only: string = 'following', limit: number = 10) {
    this.postsService.getHomeFeed(only, limit).subscribe({
      next: (res) => this.homeFeedPosts.set(res.data.posts),
    });
  }

  getUserPosts(userId: string) {
    this.postsService.getUserPosts(userId).subscribe({
      next: (res) => this.userPosts.set(res.data.posts),
    });
  }

  getBookmarks() {
    this.postsService.getBookmarks().subscribe({
      next: (res) => this.bookmarkPosts.set(res.data.bookmarks),
    });
  }
}
