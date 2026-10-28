import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post, User } from './interfaces/post.interface';
import { PostsService } from './services/posts.service';
import { afterNextRender, Component, inject, OnInit, signal } from '@angular/core';
import { required, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-posts',
  imports: [ReactiveFormsModule, FormField],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  
  allPosts = signal<Post[]>([]);
  currentuser = signal<User>(JSON.parse(localStorage.getItem('user')!) as User);
  currentuserId = signal("") ;

  imgFile = signal<File|null>(null);
  imgSrc = signal("");

    postBody = new FormControl("",[Validators.required]);
    postPrivacy = new FormControl("public");

    createdPost = signal<string>("");



  ngOnInit(): void {
    this.currentuserId.set(JSON.parse(localStorage.getItem('user')!)._id);
    this.getPostsData();
  }

  getPostsData():void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.allPosts.set(res.data.posts);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  changePhoto(e:Event) {
    let input = e.target as HTMLInputElement;

    if(input.files) {
      this.imgFile.set(input.files[0]);
      this.imgSrc.set(URL.createObjectURL( input.files[0]));
    }
  }

  submitPost(e:SubmitEvent) {
    e.preventDefault();
    let formData = new FormData();
    if(this.postBody.value)
    {
      formData.append('body',this.postBody.value);
    }
    if(this.postPrivacy.value)
    {
      formData.append('privacy',this.postPrivacy.value);
    }
    if(this.imgFile())
    {
      formData.append('image',this.imgFile()!);
    }

    this.postsService.createPost(formData).subscribe({
      next : (res) => {
        this.createdPost.set(res);
        this.getPostsData();
      },
      error : (err) => {
        console.log(err)
      },
      complete : () => {
        (e.target as HTMLFormElement).reset()

        this.imgSrc.set("");
      }
    })

  }

  deletePostData(postId:string) : void {
    this.postsService.deletePost(postId).subscribe({
      next : (res) => {
        console.log(res);
        this.getPostsData();
      },
      error : (err) => {
        console.log(err);
      }
    })
  }
}
