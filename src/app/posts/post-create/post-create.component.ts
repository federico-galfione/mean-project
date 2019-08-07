import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  @Output()
  postCreated: EventEmitter<Post> = new EventEmitter<Post>();

  constructor() {}

  ngOnInit() {}

  onAddPost() {
    if (this.formGroup.valid) {
      this.postCreated.emit(this.formGroup.value);
    }
  }
}
