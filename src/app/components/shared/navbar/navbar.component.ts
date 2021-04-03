import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  access: boolean;

  constructor(private auth: AuthService) {
    this.auth.accessVar$.subscribe((data: boolean) => {
      if (data === false && this.access) {
        this.access = false;
        this.logout();
      } else {
        this.access = data;
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }

  ngOnInit(): void {
    this.auth.start();
  }
}
