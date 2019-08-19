import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
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

  onLogin() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isLoading = true;
    this.authSvc.login(this.formGroup.value.email, this.formGroup.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
