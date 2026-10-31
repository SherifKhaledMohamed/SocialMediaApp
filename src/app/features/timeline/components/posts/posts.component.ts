import { AuthService } from './../../../../core/auth/services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post, User } from './interfaces/post.interface';
import { PostsService } from './services/posts.service';
import { afterNextRender, Component, inject, OnInit, signal, input, computed } from '@angular/core';
import { required, FormField } from '@angular/forms/signals';
import { CommentComponent } from './components/comment/comment.component';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts',
  imports: [ReactiveFormsModule, CommentComponent, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly toastrService = inject(ToastrService);
  private readonly authService = inject(AuthService);
  type = input('');
  allPosts = signal<Post[]>([]);
  currentuser = signal<User>(JSON.parse(localStorage.getItem('user')!) as User);
  currentuserId = signal('');

  imgFile = signal<File | null>(null);
  imgSrc = signal('');

  postBody = new FormControl('', [Validators.required]);
  postPrivacy = new FormControl('public');
  isUpdating = signal<boolean>(false);
  loadComments = signal<boolean>(false);
  currentPost = signal<Post | null>(null);

  ngOnInit(): void {
    this.currentuserId.set(JSON.parse(localStorage.getItem('user')!)._id);
    this.getPostsData();
  }

  postsToPreview = computed(() => {
    const posts = this.allPosts();
    switch (this.type()) {
      case 'saved':
        return posts.filter((post: Post) => post.bookmarked === true);
      case 'myposts':
        return posts.filter((post: Post) => post.user._id === this.currentuserId());
      default:
        return posts;
    }
  });

  getPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.allPosts.set(res.data.posts);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
      error: (err) => {
        console.log(err);
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
      error: (err) => {
        console.log(err);
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

  getUserPosts(userId: string) {
    this.postsService.getUserPosts(userId).subscribe({});
  }
}
