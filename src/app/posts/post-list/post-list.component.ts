import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
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
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private postSvc: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postSvc.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postSvc.getPostsUpdate().subscribe(postsData => {
      this.totalPosts = postsData.postCount;
      this.posts = postsData.posts;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
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
