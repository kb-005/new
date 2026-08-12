# Employee Management System — Angular Frontend

Professional Angular (standalone components) UI for the Employee Management System.
Connects to the ASP.NET Core Web API backend (PostgreSQL).

## Tech Stack
- Angular 17 (standalone components, lazy loading, control-flow syntax)
- TypeScript
- Angular Reactive Forms
- Angular Router (with AuthGuard)
- Angular HttpClient + RxJS
- Bootstrap 5 + Bootstrap Icons

## Project Structure
```
src/
  app/
    core/            layout.service.ts (responsive sidebar state)
    guards/          auth.guard.ts (route protection + admin-only)
    interceptors/    jwt.interceptor.ts, error.interceptor.ts
    services/        auth, employee, department, dashboard, report, toast, confirm
    models/          TypeScript interfaces for API DTOs
    components/      sidebar, navbar, toast, confirm-dialog
    pages/           login, dashboard, employees, employee-form,
                     employee-details, departments, reports, profile, not-found
  environments/      environment.ts (API base URL)
```

## Run
```bash
npm install
ng serve        # or: npm start
```
App runs at http://localhost:4200 and calls the API at https://localhost:7080/api.

## Configuration
Set the API URL in `src/environments/environment.ts` (`apiUrl`).
Do not hardcode localhost URLs across components — use `environment.apiUrl`.

## Features
Login, JWT auth, dashboard with stats, employee CRUD, search, filtering, sorting,
pagination, department management, reports with CSV export, profile, role-based
authorization, global error handling and toast notifications.
