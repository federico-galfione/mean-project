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
  isLoading: boolean = false;

  constructor(private postSvc: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postSvc.getPosts();
    this.postsSub = this.postSvc.getPostsUpdate().subscribe(posts => {
      this.posts = posts;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postSvc.deletePost(postId);
  }
}
