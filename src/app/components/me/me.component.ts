import { Component, OnInit } from '@angular/core';
import { MeData } from './me.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
})
export class MeComponent implements OnInit {
  user: any;
  constructor(private auth: AuthService) {
    this.auth.userVar$.subscribe((data: MeData) => {
      if (data !== null && data !== undefined) {
        this.user = data.user;
      }
    });
  }

  ngOnInit(): void {
    // tenemos token
    this.auth.start();
  }

  logout(): void {
    this.auth.logout();
  }
}
