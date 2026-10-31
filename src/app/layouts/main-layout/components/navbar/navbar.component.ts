import { NotificationsService } from './../../../../features/notifications/services/notifications.service';
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
  private readonly notificationsService = inject(NotificationsService);

  currentUser = signal<User>({} as User);
  notificationsCount = signal<Number>(0);

  logOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {
    initFlowbite();
    this.currentUser.set(JSON.parse(localStorage.getItem('user')!));
    this.getNotificationsCount();
  }

  getNotificationsCount(): void {
    this.notificationsService.getUnreadCount().subscribe({
      next: (res) => {
        this.notificationsCount.set(res.data.unreadCount);
      },
      complete: () => {},
    });
  }
}
