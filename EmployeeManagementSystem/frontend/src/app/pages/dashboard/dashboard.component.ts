import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard.model';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, DecimalPipe, DatePipe, RouterLink],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <h2 class="page-title">Dashboard</h2>
          <p class="page-sub">Organization overview at a glance</p>
        </div>
        <div class="quick-actions" *ngIf="isAdmin">
          <a routerLink="/employees/new" class="btn btn-primary btn-sm">
            <i class="bi bi-person-plus"></i> Add Employee
          </a>
        </div>
      </div>

      @if (summary; as s) {
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-icon bg-blue"><i class="bi bi-people"></i></div>
            <div>
              <div class="stat-value">{{ s.totalEmployees | number }}</div>
              <div class="stat-label">Total Employees</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-purple"><i class="bi bi-diagram-3"></i></div>
            <div>
              <div class="stat-value">{{ s.totalDepartments | number }}</div>
              <div class="stat-label">Departments</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-green"><i class="bi bi-person-plus"></i></div>
            <div>
              <div class="stat-value">{{ s.newEmployeesThisMonth | number }}</div>
              <div class="stat-label">New This Month</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-amber"><i class="bi bi-cash-stack"></i></div>
            <div>
              <div class="stat-value">{{ s.totalSalaryExpense | currency: 'USD':'symbol':'1.0-0' }}</div>
              <div class="stat-label">Total Payroll</div>
            </div>
          </div>
        </div>

        <div class="row-grid">
          <div class="card panel">
            <div class="panel-head">
              <h5>Employees by Department</h5>
            </div>
            <div class="panel-body">
              @if (s.employeesPerDepartment.length === 0) {
                <p class="empty">No departments found.</p>
              } @else {
                @for (d of s.employeesPerDepartment; track d.departmentId) {
                  <div class="bar-row">
                    <div class="bar-label">{{ d.departmentName }}</div>
                    <div class="bar-track">
                      <div class="bar-fill" [style.width.%]="barPercent(d.employeeCount)"></div>
                    </div>
                    <div class="bar-value">{{ d.employeeCount }}</div>
                  </div>
                }
              }
            </div>
          </div>

          <div class="card panel">
            <div class="panel-head">
              <h5>Recently Joined</h5>
              <a routerLink="/employees" class="link">View all</a>
            </div>
            <div class="panel-body">
              @if (s.recentlyJoined.length === 0) {
                <p class="empty">No employees yet.</p>
              } @else {
                <ul class="recent-list">
                  @for (r of s.recentlyJoined; track r.employeeId) {
                    <li>
                      <div class="recent-avatar">{{ initials(r.fullName) }}</div>
                      <div class="recent-info">
                        <div class="recent-name">{{ r.fullName }}</div>
                        <div class="recent-sub">{{ r.designation }} &middot; {{ r.departmentName }}</div>
                      </div>
                      <div class="recent-date">{{ r.joiningDate | date: 'mediumDate' }}</div>
                    </li>
                  }
                </ul>
              }
            </div>
          </div>
        </div>
      } @else if (loading) {
        <div class="loading-state">
          <span class="spinner-border text-primary"></span> Loading dashboard...
        </div>
      } @else {
        <div class="empty-state">
          <i class="bi bi-exclamation-circle"></i>
          <p>Could not load dashboard data.</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .stat-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .stat-card {
        background: #fff;
        border-radius: 14px;
        padding: 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
      }
      .stat-icon {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: #fff;
      }
      .bg-blue { background: #0ea5e9; }
      .bg-purple { background: #8b5cf6; }
      .bg-green { background: #22c55e; }
      .bg-amber { background: #f59e0b; }
      .stat-value { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
      .stat-label { color: #64748b; font-size: 0.85rem; }
      .row-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 1rem;
      }
      .panel {
        margin: 0;
      }
      .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .panel-head h5 { margin: 0; color: #1e293b; }
      .panel-body { padding: 0; }
      .link { color: #0ea5e9; text-decoration: none; font-size: 0.85rem; }
      .bar-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }
      .bar-label {
        width: 130px;
        font-size: 0.85rem;
        color: #334155;
      }
      .bar-track {
        flex: 1;
        background: #eef2f7;
        border-radius: 999px;
        height: 12px;
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #0ea5e9, #38bdf8);
        border-radius: 999px;
        transition: width 0.6s ease;
      }
      .bar-value {
        width: 28px;
        text-align: right;
        font-weight: 600;
        color: #334155;
      }
      .recent-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .recent-list li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f1f5f9;
      }
      .recent-list li:last-child { border-bottom: none; }
      .recent-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #0ea5e9;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.85rem;
      }
      .recent-info { flex: 1; min-width: 0; }
      .recent-name { font-weight: 600; color: #1e293b; }
      .recent-sub { font-size: 0.8rem; color: #64748b; }
      .recent-date { font-size: 0.78rem; color: #94a3b8; }
      .empty { color: #94a3b8; }
      @media (max-width: 992px) {
        .stat-grid { grid-template-columns: repeat(2, 1fr); }
        .row-grid { grid-template-columns: 1fr; }
      }
    `
  ]
})
export class DashboardComponent implements OnInit {
  loading = true;
  summary: DashboardSummary | null = null;
  isAdmin = false;

  constructor(
    private dashboardService: DashboardService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.summary = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  barPercent(count: number): number {
    const max = this.summary
      ? Math.max(1, ...this.summary.employeesPerDepartment.map((d) => d.employeeCount))
      : 1;
    return (count / max) * 100;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
