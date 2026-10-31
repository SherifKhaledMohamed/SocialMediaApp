import { ToastrService } from 'ngx-toastr';
import { CommentService } from './../../services/comment.service';

import { User } from './../../interfaces/post.interface';

import { Component, inject, input, OnInit, signal } from '@angular/core';

import { Comment } from './comment.interface';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment',

  imports: [ReactiveFormsModule],

  templateUrl: './comment.component.html',

  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit {
  private readonly commentService = inject(CommentService);

  private readonly toastrService = inject(ToastrService);

  signedUser!: User;

  postId = input('');

  allComments = signal<Comment[]>([]);

  commImgFile = signal<File | null>(null);

  commImgSrc = signal('');

  commentContent = new FormControl('', [Validators.required]);

  isUpdating = signal<boolean>(false);

  currentComment = signal<Comment | null>(null);

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

  createUpdateComment(input: HTMLInputElement, e: SubmitEvent) {
    if (this.isUpdating()) {
      this.editCommentData(input, e);

      this.isUpdating.set(false);
    } else {
      this.createNewComment(e);
    }

    this.isUpdating.set(false);
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

        this.toastrService.success('Comment Created Succesfully!', 'Aura Space');
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
      complete: () => {
        this.toastrService.success('Comment deleted Succesfully!', 'Aura Space');
      },
    });
  }

  editCommentData(input: HTMLInputElement, e: SubmitEvent): void {
    e.preventDefault();

    let formData = new FormData();

    if (this.commentContent.value) {
      formData.append('content', this.commentContent.value);
    }

    if (input.files) {
      if (input.files[0]) {
        this.commImgSrc.set(URL.createObjectURL(input.files[0]));

        this.commImgFile.set(input.files[0]);

        formData.append('image', this.commImgFile()!);
      }
    } else if (this.commImgSrc() !== '') {
      formData.append('image', this.commImgSrc());
    }

    this.commentService.editComment(this.postId(), this.currentComment()!._id, formData).subscribe({
      next: (res) => {
        this.getAllComments();
      },

      complete: () => {
        (e.target as HTMLFormElement).reset();

        this.commImgSrc.set('');
        this.toastrService.success('Comment Updated Succesfully!', 'Aura Space');
      },
    });
  }

  setCommentData(comment: Comment) {
    this.commentContent.setValue(comment.content);

    if (comment.image) {
      this.commImgSrc.set(comment.image);
    }
  }

  isUpdatingComment(comment: Comment): void {
    this.isUpdating.set(true);

    this.currentComment.set(comment);

    this.setCommentData(comment);
  }
}
