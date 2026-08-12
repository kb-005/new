# Employee Management System

A complete, full-stack **Employee Management System** built as a BE internship / project
demonstration. It replaces manual / spreadsheet-based employee record keeping with a
centralized, secure, web-based application.

```
Angular (standalone)  ──REST/JSON──▶  ASP.NET Core Web API  ──EF Core──▶  PostgreSQL
```

## 1. Project Overview
A role-based HR administration platform where **Admins** manage employees and departments
(CRUD) and **Users** can search, view and report on data. Authentication uses JWT; passwords
are BCrypt-hashed and never stored in plaintext.

## 2. Features
- User Login / Logout (JWT)
- Role-based authorization (Admin / User)
- Dashboard with KPI cards, employees-by-department chart, recently joined
- Employee management: list, add, edit, view, delete
- Search, department filter, column sorting, pagination
- Department management (count-aware; deletion blocked while employees are assigned)
- Reporting (employee list, department-wise, count/salary aggregates) with CSV export
- Form validation (frontend + backend)
- Centralized API error handling + frontend error interceptor (401/403/404/409/500/network)
- Responsive enterprise UI (sidebar + top navbar + cards + tables)
- Swagger / OpenAPI documentation with JWT support

## 3. Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17, TypeScript, Reactive Forms, Router, HttpClient, RxJS, Bootstrap 5 |
| Backend | ASP.NET Core 8 Web API, C# |
| ORM | Entity Framework Core 8 |
| Database | PostgreSQL 15+ |
| Auth | JWT Bearer + BCrypt.Net |
| Docs | Swagger / OpenAPI |
| Tools | Visual Studio (backend), VS Code (frontend), Git, Postman |

## 4. Architecture
```
backend/
  Controllers/   Auth, Employees, Departments, Dashboard, Reports
  Services/      Auth, Employee, Department, Dashboard, Report
  Repositories/  Generic + entity-specific repositories
  Models/        User, Department, Employee (entities)
  DTOs/          Request/response contracts (no raw entities exposed)
  Data/          ApplicationDbContext, Configurations, DbSeeder
  Middleware/    ExceptionHandlingMiddleware
  Helpers/       JwtHelper, PasswordHelper, MappingExtensions, AppException
  Migrations/    EF Core initial migration

frontend/
  Modular standalone components + lazy-loaded routed pages
```

The backend follows thin controllers -> services -> repositories -> DbContext. DTOs are
mapped to entities via `Helpers/MappingExtensions` so database entities are never exposed.

## 5. Folder Structure
```
EmployeeManagementSystem/
  backend/     ASP.NET Core Web API (.NET 8)
  frontend/    Angular 17 application
  database/    PostgreSQL DDL + seed reference + ER diagram
  README.md
  TESTING.md
```

## 6. Database Design
See `database/schema.sql` and `database/README.md`.

- **Users**: UserId (PK), Username (U), Email (U), PasswordHash, Role, CreatedAt
- **Departments**: DepartmentId (PK), DepartmentName (U), Description, CreatedAt
- **Employees**: EmployeeId (PK), names, Email (U), Phone, DepartmentId (FK→Departments,
  ON DELETE RESTRICT), Designation, Salary, JoiningDate, CreatedAt, UpdatedAt
- Indexes on department FK, employee last name, and unique columns.
- Relationship: **Department 1 ── MANY ── Employee**

## 7. Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- PostgreSQL 15+
- (Optional) Postman for API testing

## 8. PostgreSQL Setup
```sql
CREATE DATABASE "EmployeeManagement";
-- The app creates tables automatically via EF Core migrations on first run.
-- Or run manually: psql -U postgres -d EmployeeManagement -f database/schema.sql
```

## 9. Backend Setup
```bash
cd backend
dotnet restore
dotnet build
```
Configure the connection string + JWT key in `appsettings.json` (or via environment
variables — see section 11). Then run:
```bash
dotnet run
```
The API listens on `https://localhost:7080` (Swagger at `/swagger`).

## 10. Frontend Setup
```bash
cd frontend
npm install
npm start          # ng serve -> http://localhost:4200
```

## 11. Environment Variables
No secrets are hardcoded. The app reads:

- `ConnectionStrings__DefaultConnection` (PostgreSQL connection string)
- `Jwt__Key` (>= 16 chars secret)
- `Jwt__Issuer`, `Jwt__Audience`, `Jwt__DurationInMinutes`
- `Frontend__AllowedOrigins` (CORS origins, `;` separated)

These override the values in `appsettings.json`. Example `appsettings.json` is committed.

## 12. EF Core Migrations
The initial migration is included under `backend/Migrations`. To apply:
```bash
cd backend
dotnet tool install --global dotnet-ef
dotnet ef database update
```
Or simply `dotnet run` — the startup code calls `MigrateAsync()` and seeds demo data.

If you change the model, regenerate:
```bash
dotnet ef migrations add <Name>
dotnet ef database update
```

## 13. Running the Application
1. Start PostgreSQL; ensure `EmployeeManagement` DB exists.
2. `cd backend && dotnet run` (creates schema + seeds data).
3. `cd frontend && npm start`.
4. Open http://localhost:4200 → log in.

## 14. API Documentation
Swagger UI: `https://localhost:7080/swagger`.
Click **Authorize** and paste `Bearer <token>` (obtained from `POST /api/auth/login`) to
test protected endpoints.

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/login` | Anonymous |
| GET | `/api/auth/me` | Any |
| GET | `/api/employees` | Any |
| GET | `/api/employees/search?query=` | Any |
| POST/PUT/DELETE | `/api/employees` | Admin |
| GET | `/api/departments` | Any |
| POST/PUT/DELETE | `/api/departments` | Admin |
| GET | `/api/dashboard/summary` | Any |
| GET | `/api/reports/employees` | Any |
| GET | `/api/reports/departments` | Any |

## 15. Test Credentials
> Demo only — change passwords and JWT keys before any real deployment.

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@123` |
| User | `user` | `User@123` |

(You may also log in with the email instead of the username.)

## 16. Testing Instructions
See `TESTING.md` for the test matrix (TC-01 … TC-10 + negative cases). Manual/Postman
based; recommended flows also covered in the document.

## 17. Future Enhancements
- Refresh-token support
- Employee photo upload
- Payslip / attendance modules
- Audit logging
- PDF export of reports (frontend uses CSV + browser print for now)
- Pagination on the reports grid

---
© Employee Management System — internship project demonstration.
