import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('cardEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px) scale(0.98)' }),
        animate('260ms cubic-bezier(0.2, 0.9, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
    ]),
    trigger('modeSwap', [
      state('login', style({ transform: 'translateX(0)', opacity: 1 })),
      state('register', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('login => register', [
        style({ opacity: 0, transform: 'translateX(18px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition('register => login', [
        style({ opacity: 0, transform: 'translateX(-18px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  form: FormGroup;
  errorMessage = '';
  loading = false;
  isLogin = true;
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', []],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      securityAnswer: ['', []],
    });
    this.applyValidators();
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.form.reset();
    this.applyValidators();
  }

  private applyValidators(): void {
    const usernameCtrl = this.form.get('username');
    const emailCtrl = this.form.get('email');
    const securityCtrl = this.form.get('securityAnswer');

    usernameCtrl?.clearValidators();
    emailCtrl?.clearValidators();
    securityCtrl?.clearValidators();

    if (this.isLogin) {
      usernameCtrl?.setValidators([Validators.required]);
      emailCtrl?.setValidators([]);
      securityCtrl?.setValidators([]);
    } else {
      usernameCtrl?.setValidators([Validators.required, Validators.minLength(2)]);
      emailCtrl?.setValidators([Validators.required, Validators.email]);
      securityCtrl?.setValidators([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200),
      ]);
    }

    usernameCtrl?.updateValueAndValidity();
    emailCtrl?.updateValueAndValidity();
    securityCtrl?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    if (this.isLogin) {
      const usernameOrEmail = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;
      this.auth.login(usernameOrEmail, password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Credenciais inválidas. Tente novamente.';
        },
      });
    } else {
      const username = this.form.get('username')?.value;
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      const securityAnswer = this.form.get('securityAnswer')?.value;
      this.auth.register(username, email, password, securityAnswer).subscribe({
        next: () => {
          this.loading = false;
          this.isLogin = true;
          this.errorMessage = 'Conta criada. Faça login.';
          this.form.reset();
          this.applyValidators();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erro ao cadastrar. Tente outro usuário ou e-mail.';
        },
      });
    }
  }
}
