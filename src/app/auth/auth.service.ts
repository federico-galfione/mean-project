import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  private token: string;
  private authStatusListener: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  getAuthStatusLister() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post('http://localhost:3000/api/users/signup', authData).subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post('http://localhost:3000/api/users/login', authData).subscribe((response: { token: string }) => {
      this.token = response.token;
      if (this.token) {
        this.authStatusListener.next(true);
      } else {
        this.authStatusListener.next(false);
      }
    });
  }

  logout() {
    this.token = null;
    this.authStatusListener.next(false);
  }
}
