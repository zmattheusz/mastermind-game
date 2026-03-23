import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;
  showPassword = signal(false);
  showConfirm = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      securityAnswer: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
    });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirm(): void {
    this.showConfirm.update((v) => !v);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const newPw = this.form.get('newPassword')?.value;
    const confirm = this.form.get('confirmPassword')?.value;
    if (newPw !== confirm) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }
    this.loading = true;
    const email = this.form.get('email')?.value;
    const securityAnswer = this.form.get('securityAnswer')?.value;
    this.auth.resetPassword(email, securityAnswer, newPw).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Senha alterada. Você já pode fazer login.';
        this.form.reset();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || 'Não foi possível recuperar a senha. Verifique os dados.';
      },
    });
  }
}
