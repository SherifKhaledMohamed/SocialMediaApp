import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  
  private readonly authService = inject(AuthService);
  private readonly router = new Router;
  private readonly fb = inject(FormBuilder);



  isLoading= signal(false);
  msgText = signal("");
  leaving = false;

  sendLoginData() {
    if(this.loginForm.valid){
      this.isLoading.set(true);
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res)=> {
          if(res.success) {
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('user',JSON.stringify(res.data.user));
            this.router.navigate(['/timeline']);
          }
        },
        error: (err) => {
          this.msgText.set(err.error.message)
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      })
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }


  goToRegister() :void {
    this.leaving = true;
  }

  onPanelAnimationEnd(event: AnimationEvent) :void{
    if(this.leaving = true && event.animationName.includes("panel-out")) {
      this.router.navigate(['/register']);
    }
  }

  ngOnInit(): void {
      initFlowbite();
    }
    loginForm = this.fb.group({
      email: ["",[Validators.required,Validators.email]],
      password: ["",[Validators.required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    })

}
