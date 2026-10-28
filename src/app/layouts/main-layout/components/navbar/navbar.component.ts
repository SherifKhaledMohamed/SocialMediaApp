import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit{
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);


  logOut():void {
    this.authService.signOut();
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
