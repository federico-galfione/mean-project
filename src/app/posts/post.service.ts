import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdate: Subject<{ posts: Post[]; postCount: number }> = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map((post: any) => {
              return { id: post._id, title: post.title, content: post.content, imagePath: post.imagePath, creator: post.creator };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(res => {
        this.posts = res.posts;
        this.postsUpdate.next({ posts: [...this.posts], postCount: res.maxPosts });
      });
  }

  getPostsUpdate(): Observable<{ posts: Post[]; postCount: number }> {
    return this.postsUpdate.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>(BACKEND_URL + id);
  }

  addPost(post: Post) {
    const newPost: FormData = new FormData();
    newPost.append('title', post.title);
    newPost.append('content', post.content);
    newPost.append('image', post.image, post.title);
    this.http.post<{ message: string; post: Post }>(BACKEND_URL, newPost).subscribe(res => {
      this.router.navigate(['/']);
    });
  }

  updatePost(post: Post) {
    let newPost: Post | FormData;
    if (typeof post.image === 'object') {
      newPost = new FormData();
      newPost.append('id', post.id);
      newPost.append('title', post.title);
      newPost.append('content', post.content);
      newPost.append('image', post.image, post.title);
    } else {
      newPost = { id: post.id, title: post.title, content: post.content, imagePath: post.image, creator: post.creator };
    }
    this.http.put('posts/' + post.id, newPost).subscribe((response: Post) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
