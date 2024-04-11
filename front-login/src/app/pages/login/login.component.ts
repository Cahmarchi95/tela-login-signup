import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { LoginService } from './../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    (this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })),
      (this.signupForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      }));
  }

  submit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loginService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: () => {
          this.loginService.showMessage('Bem vindo(a)!');
          setTimeout(() => {
            this.router.navigate(['dashboard']);
          }, 2000);
        },
        error: () => {
          this.loginService.showMessage('Ocorreu um erro');
          this.loginForm.reset();
        },
      });
  }

  signup() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.loginService
      .register(
        this.signupForm.value.name,
        this.signupForm.value.email,
        this.signupForm.value.password
      )
      .subscribe({
        next: () => this.loginService.showMessage('Sign up feito com sucesso!'),
        error: () => this.loginService.showMessage('Ocorreu um erro'),
      });
    this.resetSignUpForm();
  }

  resetSignUpForm() {
    this.signupForm?.reset();
    this.clearControlValidators(this.signupForm?.get('name'));
    this.clearControlValidators(this.signupForm?.get('email'));
    this.clearControlValidators(this.signupForm?.get('password'));
    this.clearControlValidators(this.signupForm?.get('passwordConfirm'));
  }

  clearControlValidators(control: AbstractControl<any> | null) {
    if (control instanceof FormControl) {
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }
}
