import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  getUnreadCount(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'notifications/unread-count');
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
