import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgClass, RouterLink],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <h2 class="page-title">Profile</h2>
          <p class="page-sub">Your account information</p>
        </div>
      </div>

      @if (auth.currentUser; as user) {
        <div class="card profile-card">
          <div class="profile-avatar">{{ initials(user.username) }}</div>
          <h3>{{ user.username }}</h3>
          <span class="badge role-badge" [ngClass]="user.role === 'Admin' ? 'bg-success' : 'bg-info'">{{ user.role }}</span>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">User ID</div>
              <div class="info-value">{{ user.userId }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">{{ user.email }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Role</div>
              <div class="info-value">{{ user.role }}</div>
            </div>
          </div>

          <div class="detail-actions">
            <a routerLink="/dashboard" class="btn btn-light">Back to Dashboard</a>
            <button class="btn btn-outline-danger" (click)="logout()">Log Out</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .profile-card {
        padding: 2rem; text-align: center; max-width: 480px; margin: 0 auto;
      }
      .profile-avatar {
        width: 84px; height: 84px; border-radius: 50%; background: #0ea5e9; color: #fff;
        display: flex; align-items: center; justify-content: center; font-size: 2rem;
        font-weight: 700; margin: 0 auto 1rem;
      }
      .role-badge { text-transform: uppercase; letter-spacing: 0.04em; }
      .info-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;
        text-align: left;
      }
      .info-label { color: #94a3b8; font-size: 0.78rem; text-transform: uppercase; }
      .info-value { color: #1e293b; font-weight: 500; }
      .detail-actions { display: flex; gap: 0.6rem; justify-content: center; }
    `
  ]
})
export class ProfileComponent {
  constructor(public auth: AuthService, private toast: ToastService, private router: Router) {}

  initials(name: string): string {
    return name.substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.toast.info('You have been logged out.');
    this.router.navigate(['/login']);
  }
}
