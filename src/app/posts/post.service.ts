import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class PostService {
  private posts: Post[] = [];
  private postsUpdate: Subject<Post[]> = new Subject<Post[]>();

  constructor() {}

  getPosts(): Post[] {
    return [...this.posts];
  }

  getPostsUpdate(): Observable<Post[]> {
    return this.postsUpdate.asObservable();
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.postsUpdate.next(this.getPosts());
  }
}
