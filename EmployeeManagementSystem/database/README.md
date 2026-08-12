# Database

This folder contains the PostgreSQL database definition for the Employee Management System.

- `schema.sql` — full DDL (tables, constraints, foreign keys, indexes, unique constraints).
- `seed.sql` — reference seed data (departments + users). The application itself seeds demo data automatically via EF Core (`Data/DbSeeder.cs`).

## Relationships

```
Departments (1) ───< (M) Employees
   DepartmentId            DepartmentId (FK, ON DELETE RESTRICT)

Users (Admin / User) authenticate and consume the API.
Employees belong to exactly one Department.
```

## ER Diagram (text)

```
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   Users      │          │ Departments  │ 1      M │  Employees   │
├──────────────┤          ├──────────────┤ ───────> ├──────────────┤
│ UserId (PK)  │          │ DeptId (PK)  │          │ EmpId (PK)   │
│ Username (U) │          │ Name (U)     │          │ FirstName    │
│ Email (U)    │          │ Description  │          │ LastName     │
│ PasswordHash │          │ CreatedAt    │          │ Email (U)    │
│ Role         │          └──────────────┘          │ Phone        │
│ CreatedAt    │                                    │ DeptId (FK)  │
└──────────────┘                                    │ Designation  │
                                                    │ Salary       │
                                                    │ JoiningDate  │
                                                    │ CreatedAt    │
                                                    │ UpdatedAt    │
                                                    └──────────────┘
```

Legend: PK = Primary Key, U = Unique, FK = Foreign Key.

## Setup (manual)

```sql
-- 1. Create the database (as a superuser)
CREATE DATABASE "EmployeeManagement";

-- 2. Connect and run the schema
\c "EmployeeManagement"
\i schema.sql
```

The ASP.NET Core app will also create the schema and seed data on first run via EF Core migrations.
