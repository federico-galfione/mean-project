import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  enteredValue: string;
  newPost: string;

  constructor() {}

  ngOnInit() {}

  onAddPost() {
    this.newPost = this.enteredValue;
  }
}
