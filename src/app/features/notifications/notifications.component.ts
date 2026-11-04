import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationsService } from './services/notifications.service';
import { Notification, Entity, Recipient } from './models/notification.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElapsedDatePipe } from '../../shared/pipes/elapsed-date-pipe';

@Component({
  selector: 'app-notifications',
  imports: [ RouterLink,ElapsedDatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);

  allNotifications = signal<Notification[]>([]);
  notifType = signal<string>('all');
  unreadCount = this.notificationsService.unreadCount;
  ngOnInit(): void {
    this.getAllNotifications();
  }

  getUnreadNotificationsCount(): void {
    this.notificationsService.getUnreadCount().subscribe();
  }
  getAllNotifications(): void {
    this.notificationsService.getNotifications().subscribe({
      next: (res) => {
        this.allNotifications.set(res.data.notifications);
      },
      complete: () => {},
    });
  }
  markNotificationRead(id: string): void {
    this.notificationsService.markNotificationRead(id).subscribe({
      next: (res) => {
        this.getAllNotifications();
        this.getUnreadNotificationsCount();
      },
      complete: () => {},
    });
  }
  markAllNotificationsRead(): void {
    this.notificationsService.markAllNotificationsRead().subscribe({
      next: (res) => {},
      complete: () => {
        this.getAllNotifications();
        this.getUnreadNotificationsCount();
      },
    });
  }
}
