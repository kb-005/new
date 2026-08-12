import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { ToastService } from '../../services/toast.service';
import { Department } from '../../models/department.model';
import { CreateEmployeeRequest, UpdateEmployeeRequest } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <h2 class="page-title">{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h2>
          <p class="page-sub">{{ isEdit ? 'Update employee information' : 'Register a new employee' }}</p>
        </div>
        <a routerLink="/employees" class="btn btn-light btn-sm">
          <i class="bi bi-arrow-left"></i> Back to list
        </a>
      </div>

      <div class="card form-card">
        @if (loadingData) {
          <div class="loading-state"><span class="spinner-border text-primary"></span> Loading...</div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">First Name <span class="req">*</span></label>
                <input type="text" class="form-control" formControlName="firstName"
                       [class.is-invalid]="showError('firstName')" />
                @if (showError('firstName')) {
                  <div class="invalid-feedback d-block">First name is required (max 50 chars).</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Last Name <span class="req">*</span></label>
                <input type="text" class="form-control" formControlName="lastName"
                       [class.is-invalid]="showError('lastName')" />
                @if (showError('lastName')) {
                  <div class="invalid-feedback d-block">Last name is required (max 50 chars).</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Email <span class="req">*</span></label>
                <input type="email" class="form-control" formControlName="email"
                       [class.is-invalid]="showError('email')" />
                @if (showError('email')) {
                  <div class="invalid-feedback d-block">Enter a valid, unique email address.</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Phone <span class="req">*</span></label>
                <input type="text" class="form-control" formControlName="phone"
                       [class.is-invalid]="showError('phone')" />
                @if (showError('phone')) {
                  <div class="invalid-feedback d-block">Enter a valid phone number.</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Department <span class="req">*</span></label>
                <select class="form-select" formControlName="departmentId"
                        [class.is-invalid]="showError('departmentId')">
                  <option [ngValue]="null">-- Select department --</option>
                  <option *ngFor="let d of departments" [ngValue]="d.departmentId">{{ d.departmentName }}</option>
                </select>
                @if (showError('departmentId')) {
                  <div class="invalid-feedback d-block">Please select a department.</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Designation <span class="req">*</span></label>
                <input type="text" class="form-control" formControlName="designation"
                       [class.is-invalid]="showError('designation')" />
                @if (showError('designation')) {
                  <div class="invalid-feedback d-block">Designation is required (max 50 chars).</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Salary <span class="req">*</span></label>
                <input type="number" step="0.01" class="form-control" formControlName="salary"
                       [class.is-invalid]="showError('salary')" />
                @if (showError('salary')) {
                  <div class="invalid-feedback d-block">Salary must be greater than 0.</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Joining Date <span class="req">*</span></label>
                <input type="date" class="form-control" formControlName="joiningDate"
                       [class.is-invalid]="showError('joiningDate')" />
                @if (showError('joiningDate')) {
                  <div class="invalid-feedback d-block">Joining date is required.</div>
                }
              </div>
            </div>

            <div class="form-actions">
              <a routerLink="/employees" class="btn btn-outline-secondary">Cancel</a>
              <button class="btn btn-primary" type="submit" [disabled]="saving">
                <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ saving ? 'Saving...' : (isEdit ? 'Update Employee' : 'Save Employee') }}
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .form-card { padding: 1.5rem; }
      .form-label { font-weight: 500; color: #334155; }
      .req { color: #dc2626; }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.6rem;
        margin-top: 1.5rem;
      }
      .loading-state {
        text-align: center;
        padding: 2rem;
        color: #94a3b8;
      }
    `
  ]
})
export class EmployeeFormComponent implements OnInit {
  isEdit = false;
  employeeId: number | null = null;
  loadingData = false;
  saving = false;
  departments: Department[] = [];

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s()-]{7,20}$/)]],
    departmentId: [null as number | null, [Validators.required]],
    designation: ['', [Validators.required, Validators.maxLength(50)]],
    salary: [0, [Validators.required, Validators.min(0.01)]],
    joiningDate: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.departmentService.getAll().subscribe((res) => {
      if (res.success) this.departments = res.data;
    });

    if (id) {
      this.isEdit = true;
      this.employeeId = Number(id);
      this.loadingData = true;
      this.employeeService.getById(this.employeeId).subscribe({
        next: (res) => {
          this.loadingData = false;
          if (res.success) {
            const e = res.data;
            this.form.setValue({
              firstName: e.firstName,
              lastName: e.lastName,
              email: e.email,
              phone: e.phone,
              departmentId: e.departmentId,
              designation: e.designation,
              salary: e.salary,
              joiningDate: this.toDateInput(e.joiningDate)
            });
          }
        },
        error: () => {
          this.loadingData = false;
          this.toast.error('Could not load employee.');
          this.router.navigate(['/employees']);
        }
      });
    }
  }

  showError(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fix the highlighted fields.');
      return;
    }

    this.saving = true;
    const value = this.form.getRawValue();
    const payload: CreateEmployeeRequest = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim(),
      phone: value.phone.trim(),
      departmentId: value.departmentId as number,
      designation: value.designation.trim(),
      salary: value.salary,
      joiningDate: value.joiningDate
    };

    const request =
      this.isEdit && this.employeeId
        ? this.employeeService.update(this.employeeId, payload as UpdateEmployeeRequest)
        : this.employeeService.create(payload);

    request.subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.toast.success(this.isEdit ? 'Employee updated successfully.' : 'Employee created successfully.');
          this.router.navigate(['/employees']);
        }
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  private toDateInput(iso: string): string {
    return new Date(iso).toISOString().split('T')[0];
  }
}
