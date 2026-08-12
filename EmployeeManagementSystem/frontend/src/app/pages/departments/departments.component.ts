import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <h2 class="page-title">Departments</h2>
          <p class="page-sub">Organize employees by department</p>
        </div>
        @if (auth.isAdmin()) {
          <button class="btn btn-primary btn-sm" (click)="openModal()">
            <i class="bi bi-plus-lg"></i> Add Department
          </button>
        }
      </div>

      <div class="card">
        @if (loading) {
          <div class="loading-state"><span class="spinner-border text-primary"></span> Loading...</div>
        } @else if (departments.length > 0) {
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Department</th>
                  <th>Description</th>
                  <th class="text-center">Employees</th>
                  @if (auth.isAdmin()) { <th class="text-end">Actions</th> }
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of departments; let i = index">
                  <td>{{ i + 1 }}</td>
                  <td class="fw-semibold">{{ d.departmentName }}</td>
                  <td>{{ d.description || '—' }}</td>
                  <td class="text-center">
                    <span class="badge emp-count">{{ d.employeeCount }}</span>
                  </td>
                  @if (auth.isAdmin()) {
                    <td class="text-end actions">
                      <button class="icon-btn" title="Edit" (click)="openModal(d)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="icon-btn danger" title="Delete" (click)="deleteDepartment(d)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  }
                </tr>
              </tbody>
            </table>
          </div>
        } @else {
          <div class="empty-state">
            <i class="bi bi-diagram-3"></i>
            <p>No departments found.</p>
            @if (auth.isAdmin()) {
              <button class="btn btn-primary btn-sm" (click)="openModal()">Add department</button>
            }
          </div>
        }
      </div>
    </div>

    @if (showModal) {
      <div class="modal-backdrop" (click)="closeModal()"></div>
      <div class="modal-box" role="dialog" aria-modal="true">
        <h5>{{ editingId ? 'Edit Department' : 'Add Department' }}</h5>
        <form [formGroup]="form" (ngSubmit)="save()" novalidate>
          <div class="mb-3">
            <label class="form-label">Department Name <span class="req">*</span></label>
            <input type="text" class="form-control" formControlName="departmentName"
                   [class.is-invalid]="showError('departmentName')" />
            @if (showError('departmentName')) {
              <div class="invalid-feedback d-block">Name is required (max 100 chars).</div>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" rows="3" formControlName="description"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline-secondary" (click)="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [
    `
      .emp-count { background: #e0f2fe; color: #0369a1; }
      .actions { white-space: nowrap; }
      .icon-btn {
        width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
        background: #fff; color: #475569; margin-left: 0.3rem; cursor: pointer;
      }
      .icon-btn:hover { background: #f1f5f9; color: #0ea5e9; }
      .icon-btn.danger:hover { background: #fee2e2; color: #dc2626; }
      .loading-state, .empty-state {
        text-align: center; padding: 3rem 1rem; color: #94a3b8;
      }
      .empty-state i { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
      .modal-backdrop {
        position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 1080;
      }
      .modal-box {
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #fff; width: min(480px, 94vw); border-radius: 14px; padding: 1.5rem;
        z-index: 1081; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      }
      .modal-box h5 { color: #1e293b; margin-bottom: 1rem; }
      .modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 0.5rem; }
      .req { color: #dc2626; }
    `
  ]
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  loading = true;
  showModal = false;
  editingId: number | null = null;
  saving = false;

  form = this.fb.nonNullable.group({
    departmentName: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['' as string | null]
  });

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    public auth: AuthService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.departments = res.data;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openModal(d?: Department): void {
    this.editingId = d ? d.departmentId : null;
    this.form.setValue({
      departmentName: d ? d.departmentName : '',
      description: d ? d.description ?? null : null
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset();
  }

  showError(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please provide a department name.');
      return;
    }
    this.saving = true;
    const value = this.form.getRawValue();
    const request =
      this.editingId !== null
        ? this.departmentService.update(this.editingId, { departmentName: value.departmentName, description: value.description })
        : this.departmentService.create({ departmentName: value.departmentName, description: value.description });

    request.subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.toast.success(this.editingId !== null ? 'Department updated.' : 'Department created.');
          this.closeModal();
          this.load();
        }
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  deleteDepartment(d: Department): void {
    this.confirm
      .confirm({
        title: 'Delete Department',
        message: `Delete "${d.departmentName}"? Departments with assigned employees cannot be deleted.`,
        confirmText: 'Delete',
        danger: true
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.departmentService.delete(d.departmentId).subscribe({
          next: (res) => {
            if (res.success) {
              this.toast.success('Department deleted.');
              this.load();
            }
          }
        });
      });
  }
}
