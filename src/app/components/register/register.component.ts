import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RegisterResult } from './register.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  show: boolean;
  operation: number;
  message: string;

  constructor(private auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    this.auth.start();
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      lastname: new FormControl(null, {
        validators: [Validators.required],
      }),
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
    this.api.register(this.form.value).subscribe(
      ({ data }) => {
        const userResult: RegisterResult = data.register;
        if (userResult.status) {
          this.operation = 1;
        } else {
          this.operation = 2;
        }
        this.message = userResult.message;
      },
      (error) => {
        this.operation = 3;
        this.message = 'Error inesperado';
      }
    );
  }
}
