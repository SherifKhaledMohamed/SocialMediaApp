import { AuthService } from './../../core/auth/services/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  isLoading= signal(false);
  msgText = signal("");
  sendRegisterData() {
    if(this.registerForm.valid){
      this.isLoading.set(true);
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res)=> {
          console.log(res);
          if(res.success) {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.log(err);
          this.msgText.set(err.error.message)
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      })
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }
  private readonly authService = inject(AuthService);
  private readonly router = new Router;
  leaving = false;

  goToLogin() :void {
    this.leaving = true;
  }

  onPanelAnimationEnd(event: AnimationEvent) :void{
    if(this.leaving = true && event.animationName.includes("panel-out")) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
      initFlowbite();
    }

    registerForm = new FormGroup({
      name: new FormControl("",[Validators.required,Validators.minLength(3)]),
      username: new FormControl(""),
      email: new FormControl("",[Validators.required,Validators.email]),
      dateOfBirth : new FormControl("",[Validators.required]),
      gender: new FormControl("",Validators.required),
      password: new FormControl("",[Validators.required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
      rePassword: new FormControl("",[Validators.required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)])
    })

}
