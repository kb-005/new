import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { DepartmentService } from '../../services/department.service';
import { ToastService } from '../../services/toast.service';
import { EmployeeReportRow, DepartmentReportRow } from '../../models/report.model';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, DatePipe, CurrencyPipe],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <h2 class="page-title">Reports</h2>
          <p class="page-sub">Employee and department analytics</p>
        </div>
        <button class="btn btn-success btn-sm" (click)="exportCsv()" [disabled]="loading">
          <i class="bi bi-download"></i> Export CSV
        </button>
      </div>

      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button class="nav-link" [ngClass]="{ active: tab === 'employees' }" (click)="tab = 'employees'">
            Employee Report
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [ngClass]="{ active: tab === 'departments' }" (click)="tab = 'departments'">
            Department Report
          </button>
        </li>
      </ul>

      @if (tab === 'employees') {
        <div class="card">
          <div class="toolbar">
            <div class="search-box">
              <i class="bi bi-filter"></i>
              <select class="form-control" [(ngModel)]="departmentId" (change)="loadEmployees()">
                <option [ngValue]="null">All Departments</option>
                <option *ngFor="let d of departments" [ngValue]="d.departmentId">{{ d.departmentName }}</option>
              </select>
            </div>
          </div>

          @if (loading) {
            <div class="loading-state"><span class="spinner-border text-primary"></span> Generating report...</div>
          } @else {
            <div class="table-responsive">
              <table class="table table-sm table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>Phone</th>
                    <th>Department</th><th>Designation</th><th>Salary</th><th>Joining</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of employees; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td>{{ r.firstName }} {{ r.lastName }}</td>
                    <td>{{ r.email }}</td>
                    <td>{{ r.phone }}</td>
                    <td>{{ r.departmentName }}</td>
                    <td>{{ r.designation }}</td>
                    <td>{{ r.salary | currency: 'USD':'symbol':'1.2-2' }}</td>
                    <td>{{ r.joiningDate | date: 'mediumDate' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            @if (employees.length === 0) {
              <div class="empty-state"><i class="bi bi-inbox"></i><p>No records found.</p></div>
            }
          }
        </div>
      } @else {
        <div class="card">
          @if (loading) {
            <div class="loading-state"><span class="spinner-border text-primary"></span> Generating report...</div>
          } @else {
            <div class="table-responsive">
              <table class="table table-sm table-hover mb-0">
                <thead>
                  <tr>
                    <th>Department</th><th>Employees</th>
                    <th>Total Salary</th><th>Avg Salary</th><th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let d of deptReport">
                    <td class="fw-semibold">{{ d.departmentName }}</td>
                    <td><span class="badge emp-count">{{ d.employeeCount }}</span></td>
                    <td>{{ d.totalSalary | currency: 'USD':'symbol':'1.2-2' }}</td>
                    <td>{{ d.averageSalary | currency: 'USD':'symbol':'1.2-2' }}</td>
                    <td>{{ d.description || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            @if (deptReport.length === 0) {
              <div class="empty-state"><i class="bi bi-inbox"></i><p>No departments found.</p></div>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toolbar { padding: 1rem; border-bottom: 1px solid #f1f5f9; }
      .search-box { position: relative; max-width: 280px; }
      .search-box i {
        position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8;
      }
      .search-box .form-control { padding-left: 2.2rem; }
      .emp-count { background: #e0f2fe; color: #0369a1; }
      .nav-tabs .nav-link.active { color: #0ea5e9; font-weight: 600; }
      .loading-state, .empty-state { text-align: center; padding: 2.5rem 1rem; color: #94a3b8; }
      .empty-state i { font-size: 2rem; display: block; margin-bottom: 0.4rem; }
    `
  ]
})
export class ReportsComponent implements OnInit {
  tab: 'employees' | 'departments' = 'employees';
  departments: Department[] = [];
  employees: EmployeeReportRow[] = [];
  deptReport: DepartmentReportRow[] = [];
  departmentId: number | null = null;
  loading = false;

  constructor(
    private reportService: ReportService,
    private departmentService: DepartmentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.departmentService.getAll().subscribe((res) => {
      if (res.success) this.departments = res.data;
    });
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.reportService.getEmployeesReport(this.departmentId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.employees = res.data;
      },
      error: () => (this.loading = false)
    });
  }

  exportCsv(): void {
    if (this.tab === 'employees') {
      if (this.employees.length === 0) {
        this.toast.warning('Nothing to export.');
        return;
      }
      this.reportService.getEmployeesReport(this.departmentId).subscribe({
        next: (res) => {
          if (res.success) this.downloadCsv(this.toEmployeeCsv(res.data), 'employee-report.csv');
        }
      });
    } else {
      this.reportService.getDepartmentsReport().subscribe({
        next: (res) => {
          if (res.success && res.data.length) {
            this.downloadCsv(this.toDepartmentCsv(res.data), 'department-report.csv');
          } else {
            this.toast.warning('Nothing to export.');
          }
        }
      });
    }
  }

  private toEmployeeCsv(rows: EmployeeReportRow[]): string {
    const header = ['EmployeeId', 'FirstName', 'LastName', 'Email', 'Phone', 'Department', 'Designation', 'Salary', 'JoiningDate'];
    const lines = rows.map((r) => [
      r.employeeId, r.firstName, r.lastName, r.email, r.phone, r.departmentName, r.designation, r.salary, r.joiningDate
    ]);
    return this.buildCsv(header, lines);
  }

  private toDepartmentCsv(rows: DepartmentReportRow[]): string {
    const header = ['DepartmentId', 'DepartmentName', 'EmployeeCount', 'TotalSalary', 'AverageSalary', 'Description'];
    const lines = rows.map((r) => [
      r.departmentId, r.departmentName, r.employeeCount, r.totalSalary, r.averageSalary, r.description ?? ''
    ]);
    return this.buildCsv(header, lines);
  }

  private buildCsv(header: string[], lines: (string | number)[][]): string {
    const escape = (v: string | number) => {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const all = [header, ...lines];
    return all.map((row) => row.map(escape).join(',')).join('\n');
  }

  private downloadCsv(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success('CSV exported successfully.');
  }
}
