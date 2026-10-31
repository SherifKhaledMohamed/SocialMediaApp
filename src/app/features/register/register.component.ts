import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../core/auth/services/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = new Router();
  private readonly fb = inject(FormBuilder);
  private readonly toastrService = inject(ToastrService);

  isLoading = signal(false);
  msgText = signal('');
  leaving = false;

  sendRegisterData() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
          this.toastrService.success('Welcome!', 'Aura Space');
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  confirmPassword(group: AbstractControl) {
    let password = group.get('password')?.value;
    let rePassword = group.get('rePassword')?.value;
    if (password !== rePassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  goToLogin(): void {
    this.leaving = true;
  }

  onPanelAnimationEnd(event: AnimationEvent): void {
    if ((this.leaving = true && event.animationName.includes('panel-out'))) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    initFlowbite();
  }

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
    },
    { validators: [this.confirmPassword] },
  );
}
