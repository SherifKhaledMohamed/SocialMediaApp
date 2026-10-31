import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-passwrod',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './change-passwrod.component.html',
  styleUrl: './change-passwrod.component.css',
})
export class ChangePasswrodComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  isLoading = signal(false);
  msgText = signal('');

  sendPasswordData() {
    if (this.changeForm.valid) {
      this.isLoading.set(true);
      let reqBody = {
        password: this.changeForm.get('password')?.value,
        newPassword: this.changeForm.get('newPassword')?.value,
      };
      this.authService.changePassword(reqBody).subscribe({
        next: (res) => {
          if (res.success) {
            localStorage.setItem('token', res.data.token);
            this.router.navigate(['/timeline']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
          this.toastrService.success('Password Changed Successfully!', 'Aura Space');
        },
      });
    } else {
      this.changeForm.markAllAsTouched();
    }
  }
  changeForm = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      reNewPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
    },
    { validators: [this.confirmPassword] },
  );

  confirmPassword(group: AbstractControl) {
    let password = group.get('newPassword')?.value;
    let rePassword = group.get('reNewPassword')?.value;
    if (password !== rePassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }
}
