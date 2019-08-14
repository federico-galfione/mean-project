import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuth = false;
  private authListenerSub: Subscription;

  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.authListenerSub = this.authSvc.getAuthStatusLister().subscribe(isAuth => {
      this.userIsAuth = isAuth;
    });
  }

  onLogout() {
    this.authSvc.logout();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
}
