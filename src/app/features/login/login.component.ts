import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  
  private readonly router = new Router
  leaving = false;

  goToRegister() : void {
    this.leaving = true;
  }

  onPanelAnimationEnd(event:AnimationEvent):void {
    if(this.leaving = true && event.animationName.includes('panel-out')) {
      this.router.navigate(['/register']);
    }
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
