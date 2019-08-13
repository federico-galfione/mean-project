import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  formGroup: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(public authSvc: AuthService) {}

  ngOnInit() {}

  onSignup() {
    console.log('SIGNUP!', this.formGroup, this.formGroup.invalid);
    if (this.formGroup.invalid) {
      return;
    }
    this.authSvc.createUser(this.formGroup.value.email, this.formGroup.value.password);
  }
}
