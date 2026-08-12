import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass, AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../core/layout.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, AsyncPipe],
  template: `
    <aside class="sidebar" [ngClass]="{ 'sidebar-open': (layout.sidebarOpen$ | async) }">
      <div class="sidebar-brand">
        <i class="bi bi-people-fill"></i>
        <span class="brand-name">EMS</span>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" (click)="close()" class="nav-link">
          <i class="bi bi-speedometer2"></i> <span>Dashboard</span>
        </a>
        <a routerLink="/employees" routerLinkActive="active" (click)="close()" class="nav-link">
          <i class="bi bi-person-lines-fill"></i> <span>Employees</span>
        </a>
        <a routerLink="/departments" routerLinkActive="active" (click)="close()" class="nav-link">
          <i class="bi bi-diagram-3"></i> <span>Departments</span>
        </a>
        <a routerLink="/reports" routerLinkActive="active" (click)="close()" class="nav-link">
          <i class="bi bi-bar-chart-line"></i> <span>Reports</span>
        </a>
        <a routerLink="/profile" routerLinkActive="active" (click)="close()" class="nav-link">
          <i class="bi bi-person-circle"></i> <span>Profile</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-link logout-btn" (click)="logout()">
          <i class="bi bi-box-arrow-right"></i> <span>Logout</span>
        </button>
      </div>
    </aside>

    @if (layout.sidebarOpen$ | async) {
      <div class="sidebar-backdrop" (click)="close()"></div>
    }
  `,
  styles: [
    `
      .sidebar {
        width: 250px;
        background: #1e293b;
        color: #e2e8f0;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1040;
        transition: transform 0.25s ease;
      }
      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 1.25rem 1.25rem;
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .sidebar-brand i {
        color: #38bdf8;
      }
      .sidebar-nav {
        flex: 1;
        padding: 0.75rem 0;
        display: flex;
        flex-direction: column;
      }
      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.8rem 1.25rem;
        color: #cbd5e1;
        text-decoration: none;
        font-size: 0.95rem;
        border: none;
        background: none;
        text-align: left;
        width: 100%;
        cursor: pointer;
      }
      .nav-link:hover {
        background: rgba(255, 255, 255, 0.06);
        color: #fff;
      }
      .nav-link.active {
        background: #0ea5e9;
        color: #fff;
        border-left: 4px solid #38bdf8;
        padding-left: calc(1.25rem - 4px);
      }
      .sidebar-footer {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 0.5rem 0;
      }
      .logout-btn {
        color: #f87171;
      }
      .sidebar-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 1030;
      }
      @media (max-width: 992px) {
        .sidebar {
          transform: translateX(-100%);
        }
        .sidebar.sidebar-open {
          transform: translateX(0);
        }
      }
      @media (min-width: 993px) {
        .sidebar-backdrop {
          display: none;
        }
      }
    `
  ]
})
export class SidebarComponent {
  constructor(
    public layout: LayoutService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  close(): void {
    this.layout.closeSidebar();
  }

  logout(): void {
    this.auth.logout();
    this.toast.info('You have been logged out.');
    this.router.navigate(['/login']);
  }
}
