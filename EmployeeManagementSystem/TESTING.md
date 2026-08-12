# Testing — Employee Management System

This document records the test matrix and the expected/actual results. The application was
verified manually and via Postman against the running ASP.NET Core API + Angular UI.

> Legend: **Pass** = behaviour matches expectation. **N/A** = not automatable in this environment.

## Functional UI / API Tests

| Test ID | Test Condition | Expected Result | Actual Result | Status |
|---------|---------------|-----------------|---------------|--------|
| TC-01 | Valid login (admin / Admin@123) | 200 + JWT returned, redirect to dashboard | 200 + token, dashboard loads | Pass |
| TC-02 | Invalid login (wrong password) | 401 "Invalid username/email or password" | 401 returned, error shown | Pass |
| TC-03 | Add employee with valid data | 201 created, appears in list | 201, list refreshed | Pass |
| TC-04 | Add employee with missing required fields | 400 + field validation messages | 400 + inline messages | Pass |
| TC-05 | Edit existing employee | 200 updated, changes persist | 200, details updated | Pass |
| TC-06 | Delete employee (confirm) | 200 deleted, removed from list | 200, removed | Pass |
| TC-07 | Search employee by name/email | Matching subset returned | Matching rows returned | Pass |
| TC-08 | Add department with valid data | 201 created | 201, appears in list | Pass |
| TC-09 | Retrieve employee list | Paginated list returned | 200 + items | Pass |
| TC-10 | Logout | Session cleared, redirect to login | Token removed, redirect | Pass |

## Security / Negative Tests

| Test ID | Test Condition | Expected Result | Actual Result | Status |
|---------|---------------|-----------------|---------------|--------|
| TC-11 | Call `/api/employees` without token | 401 Unauthorized | 401 | Pass |
| TC-12 | Normal User calls `POST /api/employees` | 403 Forbidden | 403 | Pass |
| TC-13 | Create employee with duplicate email | 409 Conflict | 409 "already exists" | Pass |
| TC-14 | Create department with duplicate name | 409 Conflict | 409 "already exists" | Pass |
| TC-15 | Create employee with invalid salary (<=0) | 400 Validation | 400 | Pass |
| TC-16 | Create employee with invalid email | 400 Validation | 400 | Pass |
| TC-17 | Create employee with invalid phone | 400 Validation | 400 | Pass |
| TC-18 | Delete department that has employees | 409 Conflict (blocked) | 409 blocked | Pass |
| TC-19 | Edit employee with another's email | 409 Conflict | 409 | Pass |
| TC-20 | Wrong JWT signature / expired token | 401 Unauthorized | 401 | Pass |

## Database / Integration
- Migration applies schema on first run (tables Users, Departments, Employees, FKs, indexes). ✅
- Seed data inserts 2 users + 5 departments + 10 employees. ✅
- Referential integrity: deleting a department with employees is blocked (ON DELETE RESTRICT + service guard). ✅

## How to Run the Tests
1. Start PostgreSQL and create `EmployeeManagement` DB.
2. `cd backend && dotnet run`.
3. `cd frontend && npm start`, open http://localhost:4200.
4. Use the credentials in `README.md` and walk through TC-01…TC-10.
5. Use Postman (or Swagger) for TC-11…TC-20; omit/forge the Bearer token to test 401/403.

## Notes
- Automated unit tests can be added with xUnit (backend) and Jasmine/Karma (frontend). The
  current suite is manual + Postman based as documented above.
