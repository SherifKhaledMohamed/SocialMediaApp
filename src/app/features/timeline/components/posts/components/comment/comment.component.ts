import { CommentService } from './../../services/comment.service';
import { User } from './../../interfaces/post.interface';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Comment } from './comment.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UrlCodec } from '@angular/common/upgrade';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-comment',
  imports: [ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit {
  signedUser!: User;
  postId = input('');
  private readonly commentService = inject(CommentService);
  allComments = signal<Comment[]>([]);
  commImgFile = signal<File | null>(null);
  commImgSrc = signal('');
  commentContent = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.signedUser = JSON.parse(localStorage.getItem('user')!);
    this.getAllComments();
  }
  getAllComments(): void {
    this.commentService.getAllComments(this.postId()).subscribe({
      next: (res) => {
        this.allComments.set(res.data.comments);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  changeCommPhoto(el: Event) {
    let commInput = el.target as HTMLInputElement;

    if (commInput.files) {
      this.commImgFile.set(commInput.files[0]);
      this.commImgSrc.set(URL.createObjectURL(commInput.files[0]));
    }
  }

  createNewComment(e: SubmitEvent) {
    e.preventDefault();
    let formData = new FormData();

    if (this.commentContent.value) {
      formData.append('content', this.commentContent.value);
    }
    if (this.commImgFile()) {
      formData.append('image', this.commImgFile()!);
    }
    this.commentService.createComment(this.postId(), formData).subscribe({
      next: (res) => {
        this.getAllComments();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        let form = e.target as HTMLFormElement;
        form.reset();
        this.commImgSrc.set('');
      },
    });
  }

  deleteCommentData(commentId: string): void {
    this.commentService.deleteComment(this.postId(), commentId).subscribe({
      next: (res) => {
        this.getAllComments();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editCommentData(comment: Comment, input: HTMLInputElement): void {
    this.commentContent.setValue(comment.content);
    if (comment.image) {
      this.commImgSrc.set(comment.image);
    }

    let formData = new FormData();
    if (this.commentContent.value) {
      formData.append('content', this.commentContent.value);
    }
    if (input.files) {
      this.commImgSrc.set(URL.createObjectURL(input.files[0]));
      this.commImgFile.set(input.files[0]);
      formData.append('image', this.commImgFile()!);
    } else if (this.commImgSrc()) {
      formData.append('image', this.commImgSrc());
    }

    this.commentService.editComment(this.postId(), comment._id, formData).subscribe({
      next: (res) => {
        this.getAllComments();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }
}
