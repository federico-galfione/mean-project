import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PostService {
  private posts: Post[] = [];
  private postsUpdate: Subject<Post[]> = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(): void {
    this.http
      .get<{ message: string; posts: Post[] }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map((post: any) => {
            return { id: post._id, title: post.title, content: post.content };
          });
        })
      )
      .subscribe(res => {
        this.posts = res;
        this.postsUpdate.next([...this.posts]);
      });
  }

  getPostsUpdate(): Observable<Post[]> {
    return this.postsUpdate.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(post: Post) {
    const newPost: FormData = new FormData();
    newPost.append('title', post.title);
    newPost.append('content', post.content);
    newPost.append('image', post.image, post.title);
    this.http.post<{ message: string; postId: string }>('http://localhost:3000/api/posts', post).subscribe(res => {
      const resPost: Post = { id: res.postId, title: post.title, content: post.content };
      this.postsUpdate.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(post: Post) {
    this.http.put('http://localhost:3000/api/posts/' + post.id, post).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe(() => {
      this.posts = this.posts.filter(x => x.id !== postId);
      this.postsUpdate.next([...this.posts]);
    });
  }
}
