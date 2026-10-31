import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserProfile } from './models/user-profile.interface';
import { ToastrService } from 'ngx-toastr';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { PostsService } from '../timeline/components/posts/services/posts.service';
import { NgClass } from '@angular/common';
import { Post } from '../timeline/components/posts/interfaces/post.interface';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);
  private readonly postsService = inject(PostsService);

  currentUser = signal<UserProfile>({} as UserProfile);
  isCover = signal<boolean>(false);
  imagePreview = signal<string>('');
  imageSrc = signal<string>('');
  imageFile = signal<File | null>(null);
  postPrivacy = new FormControl('public');
  profilePosts = signal<Post[]>([]);
  allPostsBookmarked = signal<Post[]>([]);
  postsToShow = signal<Post[]>([]);

  coverImage = signal<string>('');

  ngOnInit(): void {
    this.getUserProfile();
    initFlowbite();
  }

  getUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.currentUser.set(res.data.user);
        this.coverImage.set(this.currentUser().cover);
      },
      complete: () => {
        this.getUserPosts();
        this.getPostsData();
      },
    });
  }

  getUserPosts() {
    this.authService.getUserPosts(this.currentUser()._id).subscribe({
      next: (res) => {
        this.profilePosts.set(res.data.posts);
        this.postsToShow.set(res.data.posts);
      },
      complete: () => {},
    });
  }

  getPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.allPostsBookmarked.set(res.data.posts.filter((post: any) => post.bookmarked === true));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addChangeCover(e: Event) {
    e.preventDefault();
    const file = this.imageFile();
    if (!file) return;

    const formData = new FormData();
    formData.append('cover', file);
    this.uploadCover(formData);
  }

  changePhoto(e: Event) {
    let input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.imageFile.set(file);
      this.imageSrc.set(URL.createObjectURL(file));
      input.value = '';
    }
  }

  uploadCover(data: FormData) {
    this.authService.uploadCover(data).subscribe({
      next: (res) => {},
      complete: () => {
        this.toastrService.success('Cover Image Changed Successfully!', 'Aura Space');
        this.changeImagePost('Cover image has been updated!');
        this.getUserProfile();
      },
    });
  }
  changeImagePost(body: string) {
    this.postsService.createPost(this.submitPost(body)).subscribe({
      complete: () => {
        this.imageFile.set(null);
        this.imageSrc.set('');
      },
    });
  }

  submitPost(body: string): FormData {
    let formData = new FormData();
    if (body) {
      formData.append('body', body);
    }
    if (this.postPrivacy.value) {
      formData.append('privacy', this.postPrivacy.value);
    }
    if (this.imageFile()) {
      formData.append('image', this.imageFile()!);
    }
    return formData;
  }

  removeCover() {
    this.authService.deleteCover().subscribe({
      next: () => {
        this.coverImage.set('');
        this.currentUser.update((u) => ({ ...u, cover: '' }));
        this.toastrService.success('Cover Image Removed Successfully', 'Aura Space');
      },
    });
  }

  setProfileImage(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    input.value = '';
    this.changeProfileImage(formData);
  }

  changeProfileImage(data: FormData) {
    this.authService.updateProfileImage(data).subscribe({
      next: () => {
        this.toastrService.success('Profile Image Changed Successfully!', 'Aura Space');
        this.getUserProfile();
      },
    });
  }
}
