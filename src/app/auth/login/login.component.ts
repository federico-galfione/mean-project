import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  formGroup: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(public authSvc: AuthService) {}

  ngOnInit() {}

  onLogin() {
    if (this.formGroup.invalid) {
      return;
    }
    this.authSvc.login(this.formGroup.value.email, this.formGroup.value.password);
  }
}
