import { Component, inject, OnInit, signal } from '@angular/core';
import { SideLeftComponent } from './components/side-left/side-left.component';
import { SideRightComponent } from './components/side-right/side-right.component';
import { PostsComponent } from './components/posts/posts.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timeline',
  imports: [SideLeftComponent, SideRightComponent, PostsComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  type = signal('');

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.type.set(params.get('type') ?? '');
    });
  }
}
