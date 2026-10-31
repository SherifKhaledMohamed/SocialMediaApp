import { Suggestions } from './models/suggestions.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-side-right',
  imports: [],
  templateUrl: './side-right.component.html',
  styleUrl: './side-right.component.css',
})
export class SideRightComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);
  friendSuggestions = signal<Suggestions[]>([]);

  ngOnInit(): void {
    this.getSuggestedFriends();
  }

  getSuggestedFriends(): void {
    this.authService.getSuggestedFriends().subscribe({
      next: (res) => {
        this.friendSuggestions.set(res.data.suggestions);
      },
    });
  }
  followUser(userId: string): void {
    this.authService.followUser(userId).subscribe({
      next: (res) => {
        this.getSuggestedFriends();
      },
      complete: () => {
        this.toastrService.success('User Followed Successfully', 'Aura Space');
      },
    });
  }
}
