import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, NgIf],
  template: `
    <header class="topbar">
      <button class="menu-toggle" (click)="layout.toggleSidebar()" aria-label="Toggle navigation">
        <i class="bi bi-list"></i>
      </button>

      <div class="topbar-title">Employee Management System</div>

      <div class="topbar-user" *ngIf="auth.currentUser as user">
        <div class="user-meta">
          <span class="user-name">{{ user.username }}</span>
          <span class="user-role" [ngClass]="user.role === 'Admin' ? 'role-admin' : 'role-user'">
            {{ user.role }}
          </span>
        </div>
        <div class="avatar">
          <i class="bi bi-person-fill"></i>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .topbar {
        height: 64px;
        background: #fff;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0 1.25rem;
        position: sticky;
        top: 0;
        z-index: 1020;
      }
      .menu-toggle {
        border: none;
        background: #f1f5f9;
        border-radius: 8px;
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
        cursor: pointer;
        color: #334155;
      }
      .topbar-title {
        font-weight: 600;
        color: #1e293b;
        font-size: 1.1rem;
      }
      .topbar-user {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .user-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.2;
      }
      .user-name {
        font-weight: 600;
        color: #1e293b;
      }
      .user-role {
        font-size: 0.72rem;
        padding: 1px 8px;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .role-admin {
        background: #dcfce7;
        color: #166534;
      }
      .role-user {
        background: #e0f2fe;
        color: #075985;
      }
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #0ea5e9;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
      }
      @media (max-width: 768px) {
        .topbar-title {
          font-size: 0.95rem;
        }
      }
    `
  ]
})
export class NavbarComponent {
  constructor(public auth: AuthService, public layout: LayoutService) {}
}
