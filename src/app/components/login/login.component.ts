import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoginResult } from './login.interface';
import { MeData } from '../me/me.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: boolean;
  show: boolean;

  constructor(
    private readonly api: ApiService,
    private router: Router,
    private auth: AuthService
  ) {
    this.auth.userVar$.subscribe((data: MeData) => {
      if (data === null || data.status === false) {
        this.show = true;
      } else {
        this.show = false;
      }
    });
  }

  ngOnInit(): void {
    this.auth.start();
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  save(): void {
    const { email, password } = this.form.value;
    this.api.login(email, password).subscribe((resp: LoginResult) => {
      this.show = true;
      if (resp.status) {
        this.error = false;
        localStorage.setItem('tokenJWT', resp.token);
        this.auth.updateStateSession(true);
        this.router.navigate(['/me']);
      } else {
        this.error = true;
        this.auth.updateStateSession(false);
        localStorage.removeItem('tokenJWT');
      }
    });
  }
}
