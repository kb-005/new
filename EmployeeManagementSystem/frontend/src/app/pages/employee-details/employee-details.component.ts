import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [RouterLink, NgIf, DatePipe, CurrencyPipe],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <h2 class="page-title">Employee Details</h2>
          <p class="page-sub">Profile information</p>
        </div>
        <a routerLink="/employees" class="btn btn-light btn-sm">
          <i class="bi bi-arrow-left"></i> Back
        </a>
      </div>

      @if (employee; as e) {
        <div class="card profile-card">
          <div class="profile-header">
            <div class="profile-avatar">{{ initials(e.fullName || (e.firstName + ' ' + e.lastName)) }}</div>
            <div>
              <h3>{{ e.fullName || (e.firstName + ' ' + e.lastName) }}</h3>
              <div class="profile-sub">{{ e.designation }} &middot; {{ e.departmentName }}</div>
              <span class="badge emp-id">ID: {{ e.employeeId }}</span>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">{{ e.email }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Phone</div>
              <div class="info-value">{{ e.phone }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Department</div>
              <div class="info-value">{{ e.departmentName }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Designation</div>
              <div class="info-value">{{ e.designation }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Salary</div>
              <div class="info-value">{{ e.salary | currency: 'USD':'symbol':'1.2-2' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Joining Date</div>
              <div class="info-value">{{ e.joiningDate | date: 'longDate' }}</div>
            </div>
          </div>

          <div class="detail-actions">
            @if (auth.isAdmin()) {
              <a [routerLink]="['/employees', e.employeeId, 'edit']" class="btn btn-primary">
                <i class="bi bi-pencil"></i> Edit
              </a>
              <button class="btn btn-outline-danger" (click)="deleteEmployee(e)">
                <i class="bi bi-trash"></i> Delete
              </button>
            }
            <a routerLink="/employees" class="btn btn-light">Back to list</a>
          </div>
        </div>
      } @else if (loading) {
        <div class="loading-state"><span class="spinner-border text-primary"></span> Loading...</div>
      } @else {
        <div class="empty-state">
          <i class="bi bi-exclamation-circle"></i>
          <p>Employee not found.</p>
          <a routerLink="/employees" class="btn btn-primary btn-sm">Back to list</a>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .profile-card { padding: 1.75rem; }
      .profile-header {
        display: flex;
        gap: 1.25rem;
        align-items: center;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 1.25rem;
        margin-bottom: 1.25rem;
      }
      .profile-avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: #0ea5e9;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        font-weight: 700;
      }
      .profile-header h3 { margin: 0; color: #1e293b; }
      .profile-sub { color: #64748b; }
      .emp-id { background: #f1f5f9; color: #475569; margin-top: 0.4rem; }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
      }
      .info-label { color: #94a3b8; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; }
      .info-value { color: #1e293b; font-weight: 500; margin-top: 0.2rem; }
      .detail-actions { display: flex; gap: 0.6rem; margin-top: 1.5rem; flex-wrap: wrap; }
      .loading-state, .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #94a3b8;
      }
      .empty-state i { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
      @media (max-width: 768px) {
        .info-grid { grid-template-columns: repeat(2, 1fr); }
      }
    `
  ]
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    public auth: AuthService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.employee = res.data;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Could not load employee.');
        this.router.navigate(['/employees']);
      }
    });
  }

  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  deleteEmployee(e: Employee): void {
    this.confirm
      .confirm({
        title: 'Delete Employee',
        message: `Delete "${e.fullName || e.firstName + ' ' + e.lastName}"? This cannot be undone.`,
        confirmText: 'Delete',
        danger: true
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.employeeService.delete(e.employeeId).subscribe({
          next: (res) => {
            if (res.success) {
              this.toast.success('Employee deleted.');
              this.router.navigate(['/employees']);
            }
          }
        });
      });
  }
}
