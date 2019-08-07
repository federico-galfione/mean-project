import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[];
  postsSub: Subscription;

  constructor(private postSvc: PostService) {}

  ngOnInit() {
    this.posts = this.postSvc.getPosts();
    this.postsSub = this.postSvc.getPostsUpdate().subscribe(posts => (this.posts = posts));
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
