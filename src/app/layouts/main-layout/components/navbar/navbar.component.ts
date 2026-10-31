import { User } from './../../../../features/timeline/components/posts/interfaces/post.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  currentUser = signal<User>({} as User);

  logOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {
    initFlowbite();
    this.currentUser.set(JSON.parse(localStorage.getItem('user')!));
  }
}
