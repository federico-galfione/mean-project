import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  formGroup: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(public authSvc: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authSvc.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignup() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isLoading = true;
    this.authSvc.createUser(this.formGroup.value.email, this.formGroup.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
