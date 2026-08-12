import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass, DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Employee, PagedResult } from '../../models/employee.model';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, DatePipe, CurrencyPipe, DecimalPipe, RouterLink],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <h2 class="page-title">Employees</h2>
          <p class="page-sub">Manage employee records</p>
        </div>
        @if (auth.isAdmin()) {
          <a routerLink="/employees/new" class="btn btn-primary btn-sm">
            <i class="bi bi-person-plus"></i> Add Employee
          </a>
        }
      </div>

      <div class="card toolbar">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            type="text"
            class="form-control"
            placeholder="Search by name, email, designation..."
            [(ngModel)]="search"
            (keyup.enter)="applyFilters()"
          />
        </div>
        <select class="form-select" [(ngModel)]="departmentId" (change)="applyFilters()">
          <option [ngValue]="null">All Departments</option>
          <option *ngFor="let d of departments" [ngValue]="d.departmentId">{{ d.departmentName }}</option>
        </select>
        <button class="btn btn-outline-secondary btn-sm" (click)="applyFilters()" [disabled]="loading">
          <i class="bi bi-funnel"></i> Filter
        </button>
        <button class="btn btn-light btn-sm" (click)="clearFilters()" [disabled]="loading">
          <i class="bi bi-arrow-counterclockwise"></i> Clear
        </button>
        <button class="btn btn-light btn-sm" (click)="load()" [disabled]="loading">
          <i class="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      <div class="card table-card">
        @if (loading) {
          <div class="loading-state"><span class="spinner-border text-primary"></span> Loading employees...</div>
        } @else if (result && result.items.length > 0) {
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th (click)="sortBy('firstname')" class="sortable">#</th>
                  <th (click)="sortBy('firstname')" class="sortable">Name <i [ngClass]="sortIcon('firstname')"></i></th>
                  <th (click)="sortBy('email')" class="sortable">Email <i [ngClass]="sortIcon('email')"></i></th>
                  <th>Phone</th>
                  <th (click)="sortBy('department')" class="sortable">Department <i [ngClass]="sortIcon('department')"></i></th>
                  <th (click)="sortBy('designation')" class="sortable">Designation <i [ngClass]="sortIcon('designation')"></i></th>
                  <th (click)="sortBy('salary')" class="sortable">Salary <i [ngClass]="sortIcon('salary')"></i></th>
                  <th (click)="sortBy('joiningdate')" class="sortable">Joining <i [ngClass]="sortIcon('joiningdate')"></i></th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let e of result.items; let i = index">
                  <td>{{ index(i) }}</td>
                  <td>
                    <div class="emp-name">{{ e.fullName || (e.firstName + ' ' + e.lastName) }}</div>
                  </td>
                  <td>{{ e.email }}</td>
                  <td>{{ e.phone }}</td>
                  <td><span class="badge dept-badge">{{ e.departmentName }}</span></td>
                  <td>{{ e.designation }}</td>
                  <td>{{ e.salary | currency: 'USD':'symbol':'1.2-2' }}</td>
                  <td>{{ e.joiningDate | date: 'mediumDate' }}</td>
                  <td class="text-end actions">
                    <a [routerLink]="['/employees', e.employeeId]" class="icon-btn" title="View">
                      <i class="bi bi-eye"></i>
                    </a>
                    @if (auth.isAdmin()) {
                      <a [routerLink]="['/employees', e.employeeId, 'edit']" class="icon-btn" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </a>
                      <button class="icon-btn danger" title="Delete" (click)="deleteEmployee(e)">
                        <i class="bi bi-trash"></i>
                      </button>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination-bar">
            <span class="page-info">
              Showing {{ rangeStart() }}–{{ rangeEnd() }} of {{ result.totalItems }} employees
            </span>
            <div class="pager">
              <button class="btn btn-sm btn-outline-secondary" [disabled]="page <= 1" (click)="goToPage(page - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
              <span class="page-num">Page {{ page }} / {{ result.totalPages || 1 }}</span>
              <button class="btn btn-sm btn-outline-secondary" [disabled]="page >= result.totalPages" (click)="goToPage(page + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <i class="bi bi-people"></i>
            <p>No employees found.</p>
            @if (auth.isAdmin()) {
              <a routerLink="/employees/new" class="btn btn-primary btn-sm">Add your first employee</a>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        align-items: center;
        margin-bottom: 1rem;
      }
      .search-box {
        position: relative;
        flex: 1;
        min-width: 220px;
      }
      .search-box i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
      }
      .search-box .form-control {
        padding-left: 2.2rem;
      }
      .toolbar .form-select {
        width: auto;
        min-width: 170px;
      }
      .table-card { overflow: hidden; }
      .sortable { cursor: pointer; user-select: none; white-space: nowrap; }
      .sortable i { font-size: 0.75rem; color: #94a3b8; }
      .dept-badge {
        background: #e0f2fe;
        color: #0369a1;
        font-weight: 500;
      }
      .emp-name { font-weight: 600; color: #1e293b; }
      .actions { white-space: nowrap; }
      .icon-btn {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: #fff;
        color: #475569;
        margin-left: 0.3rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        text-decoration: none;
      }
      .icon-btn:hover { background: #f1f5f9; color: #0ea5e9; }
      .icon-btn.danger:hover { background: #fee2e2; color: #dc2626; }
      .pagination-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.9rem 1rem;
        border-top: 1px solid #f1f5f9;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .page-info { color: #64748b; font-size: 0.85rem; }
      .pager { display: flex; align-items: center; gap: 0.6rem; }
      .page-num { color: #475569; font-size: 0.85rem; }
      .empty-state, .loading-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #94a3b8;
      }
      .empty-state i { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
    `
  ]
})
export class EmployeesComponent implements OnInit {
  result: PagedResult<Employee> | null = null;
  departments: Department[] = [];
  loading = false;
  search = '';
  departmentId: number | null = null;
  page = 1;
  pageSize = 10;
  sortByField = 'employeeid';
  sortDescending = false;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    public auth: AuthService,
    private toast: ToastService,
    private confirm: ConfirmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.departmentService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.departments = res.data;
      }
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.employeeService
      .getPaged({
        page: this.page,
        pageSize: this.pageSize,
        search: this.search || undefined,
        departmentId: this.departmentId,
        sortBy: this.sortByField,
        sortDescending: this.sortDescending
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) this.result = res.data;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  clearFilters(): void {
    this.search = '';
    this.departmentId = null;
    this.page = 1;
    this.load();
  }

  sortBy(field: string): void {
    if (this.sortByField === field) {
      this.sortDescending = !this.sortDescending;
    } else {
      this.sortByField = field;
      this.sortDescending = false;
    }
    this.load();
  }

  sortIcon(field: string): string {
    if (this.sortByField !== field) return 'bi-arrow-down-up';
    return this.sortDescending ? 'bi-sort-down-alt' : 'bi-sort-up-alt';
  }

  goToPage(p: number): void {
    if (p < 1) return;
    this.page = p;
    this.load();
  }

  index(i: number): number {
    return (this.page - 1) * this.pageSize + i + 1;
  }

  rangeStart(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  rangeEnd(): number {
    if (!this.result) return 0;
    return Math.min(this.result.totalItems, this.page * this.pageSize);
  }

  deleteEmployee(e: Employee): void {
    this.confirm
      .confirm({
        title: 'Delete Employee',
        message: `Are you sure you want to delete "${e.fullName || e.firstName + ' ' + e.lastName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        danger: true
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.employeeService.delete(e.employeeId).subscribe({
          next: (res) => {
            if (res.success) {
              this.toast.success('Employee deleted successfully.');
              this.load();
            }
          }
        });
      });
  }
}
