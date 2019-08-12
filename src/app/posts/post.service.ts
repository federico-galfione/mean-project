import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PostService {
  private posts: Post[] = [];
  private postsUpdate: Subject<Post[]> = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

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

  addPost(post: Post) {
    const newPost: Post = { id: null, title: post.title, content: post.content };
    this.http.post<{ message: string; postId: string }>('http://localhost:3000/api/posts', post).subscribe(res => {
      newPost.id = res.postId;
      this.posts.push(newPost);
      this.postsUpdate.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe(() => {
      this.posts = this.posts.filter(x => x.id !== postId);
      this.postsUpdate.next([...this.posts]);
    });
  }
}
