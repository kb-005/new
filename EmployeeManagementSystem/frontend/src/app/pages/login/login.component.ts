import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgClass],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <i class="bi bi-people-fill"></i>
          </div>
          <h1>Employee Management System</h1>
          <p class="subtitle">Sign in to your account</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="mb-3">
            <label class="form-label">Username or Email</label>
            <div class="input-icon">
              <i class="bi bi-person"></i>
              <input
                type="text"
                class="form-control"
                formControlName="identifier"
                placeholder="admin or admin@ems.com"
                autocomplete="username"
                [class.is-invalid]="showError('identifier')"
              />
            </div>
            @if (showError('identifier')) {
              <div class="invalid-feedback d-block">Username or email is required.</div>
            }
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <div class="input-icon">
              <i class="bi bi-lock"></i>
              <input
                [type]="hidePassword ? 'password' : 'text'"
                class="form-control"
                formControlName="password"
                placeholder="Enter your password"
                autocomplete="current-password"
                [class.is-invalid]="showError('password')"
              />
              <button type="button" class="pw-toggle" (click)="hidePassword = !hidePassword" tabindex="-1">
                <i class="bi" [ngClass]="hidePassword ? 'bi-eye' : 'bi-eye-slash'"></i>
              </button>
            </div>
            @if (showError('password')) {
              <div class="invalid-feedback d-block">Password is required (min 6 characters).</div>
            }
          </div>

          @if (errorMessage) {
            <div class="alert alert-danger py-2">{{ errorMessage }}</div>
          }

          <button class="btn btn-primary w-100 login-btn" type="submit" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="demo-credentials">
          <strong>Demo credentials</strong>
          <div>Admin: <code>admin</code> / <code>Admin&#64;123</code></div>
          <div>User: <code>user</code> / <code>User&#64;123</code></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%);
        padding: 1rem;
      }
      .login-card {
        background: #fff;
        width: min(420px, 96vw);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
      }
      .login-header {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .logo {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: #0ea5e9;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        margin: 0 auto 0.75rem;
      }
      .login-header h1 {
        font-size: 1.25rem;
        color: #1e293b;
        margin-bottom: 0.25rem;
      }
      .subtitle {
        color: #64748b;
        margin: 0;
      }
      .input-icon {
        position: relative;
      }
      .input-icon i.bi-person,
      .input-icon i.bi-lock {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
      }
      .input-icon .form-control {
        padding-left: 2.2rem;
      }
      .pw-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        border: none;
        background: transparent;
        color: #64748b;
        cursor: pointer;
      }
      .login-btn {
        padding: 0.6rem;
        font-weight: 600;
      }
      .demo-credentials {
        margin-top: 1.25rem;
        background: #f1f5f9;
        border-radius: 10px;
        padding: 0.75rem 1rem;
        font-size: 0.82rem;
        color: #475569;
      }
      .demo-credentials code {
        background: #e2e8f0;
        padding: 0 5px;
        border-radius: 4px;
      }
    `
  ]
})
export class LoginComponent implements OnInit {
  loading = false;
  errorMessage = '';
  hidePassword = true;
  form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  showError(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload: LoginRequest = this.form.getRawValue();

    this.auth.login(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toast.success('Welcome back!');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message ?? 'Login failed.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid username/email or password.';
      }
    });
  }
}
