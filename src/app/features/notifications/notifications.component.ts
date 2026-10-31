import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationsService } from './services/notifications.service';
import { Notification, Entity, Recipient } from './models/notification.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [NgClass],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);

  allNotifications = signal<Notification[]>([]);
  notifType = signal<string>('all');
  unreadCount = signal<number>(0);
  ngOnInit(): void {
    this.getAllNotifications();
  }

  getUnreadNotificationsCount(): void {
    this.notificationsService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount.set(res.data.unreadCount);
      },
      complete: () => {},
    });
  }
  getAllNotifications(): void {
    this.notificationsService.getNotifications().subscribe({
      next: (res) => {
        console.log(res.data.notifications);
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
