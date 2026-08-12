import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Sign in - Employee Management System',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'dashboard',
    title: 'Dashboard - Employee Management System',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employees',
    title: 'Employees - Employee Management System',
    loadComponent: () =>
      import('./pages/employees/employees.component').then((m) => m.EmployeesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employees/new',
    title: 'Add Employee - Employee Management System',
    loadComponent: () =>
      import('./pages/employee-form/employee-form.component').then((m) => m.EmployeeFormComponent),
    canActivate: [authGuard],
    data: { adminOnly: true }
  },
  {
    path: 'employees/:id',
    title: 'Employee Details - Employee Management System',
    loadComponent: () =>
      import('./pages/employee-details/employee-details.component').then((m) => m.EmployeeDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employees/:id/edit',
    title: 'Edit Employee - Employee Management System',
    loadComponent: () =>
      import('./pages/employee-form/employee-form.component').then((m) => m.EmployeeFormComponent),
    canActivate: [authGuard],
    data: { adminOnly: true }
  },
  {
    path: 'departments',
    title: 'Departments - Employee Management System',
    loadComponent: () =>
      import('./pages/departments/departments.component').then((m) => m.DepartmentsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    title: 'Reports - Employee Management System',
    loadComponent: () =>
      import('./pages/reports/reports.component').then((m) => m.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    title: 'Profile - Employee Management System',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    title: 'Page Not Found - Employee Management System',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
