import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  formGroup: FormGroup = new FormGroup({
    title: new FormControl(null, Validators.required),
    content: new FormControl(null, Validators.required),
    image: new FormControl(null, Validators.required, mimeType)
  });

  imagePreview: string;
  isLoading = false;
  private mode: 'create' | 'edit' = 'create';
  private postId: string;
  private post: Post;
  private authStatusSub: Subscription;

  constructor(private postSvc: PostService, public route: ActivatedRoute, private authSvc: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authSvc.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postSvc.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath } as Post;
          this.formGroup.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      if (this.mode === 'create') {
        this.postSvc.addPost(this.formGroup.value);
      } else {
        this.postSvc.updatePost({ id: this.post.id, ...this.formGroup.value });
      }
      this.formGroup.reset();
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.formGroup.patchValue({ image: file });
    this.formGroup.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
