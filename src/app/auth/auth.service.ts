import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post('http://localhost:3000/api/users/signup', authData).subscribe(response => {
      console.log(response);
    });
  }
}
