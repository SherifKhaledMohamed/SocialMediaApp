import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  unreadCount = signal<number>(0);

  getUnreadCount(): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + 'notifications/unread-count').pipe(tap((res) => this.unreadCount.set(res.data.unreadCount)));
  }
  getNotifications(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'notifications');
  }
  markNotificationRead(id: string): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `notifications/${id}/read`, null);
  }
  markAllNotificationsRead(): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `notifications/read-all`, null);
  }
}
