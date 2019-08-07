import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    title: new FormControl(null, Validators.required),
    content: new FormControl(null, Validators.required)
  });

  constructor(private postSvc: PostService) {}

  ngOnInit() {}

  onAddPost() {
    if (this.formGroup.valid) {
      this.postSvc.addPost(this.formGroup.value);
      this.formGroup.reset();
    }
  }
}
