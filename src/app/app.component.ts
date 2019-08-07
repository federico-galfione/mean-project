import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mean-project';
  posts: Post[] = [];

  addPost(post: Post) {
    this.posts.push(post);
  }
}
