import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userId: string;
  userIsAuth = false;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private postSvc: PostService, private authSvc: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postSvc.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authSvc.getUserId();
    this.postsSub = this.postSvc.getPostsUpdate().subscribe(postsData => {
      this.totalPosts = postsData.postCount;
      this.posts = postsData.posts;
      this.isLoading = false;
    });
    this.authStatusSub = this.authSvc.getAuthStatusLister().subscribe(isAuth => {
      this.userIsAuth = isAuth;
      this.userId = this.authSvc.getUserId();
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postSvc.deletePost(postId).subscribe(() => {
      this.postSvc.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postSvc.getPosts(this.postsPerPage, this.currentPage);
  }
}
