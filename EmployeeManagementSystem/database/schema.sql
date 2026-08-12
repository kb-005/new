-- =========================================================
-- Employee Management System - PostgreSQL Database Schema
-- =========================================================
-- Run this script in a PostgreSQL database (e.g. via psql):
--   psql -U postgres -d EmployeeManagement -f schema.sql
--
-- The application can also create this schema automatically via
-- EF Core migrations (see backend README). This file is provided
-- for documentation, review, and manual setup.
-- =========================================================

-- 1. Users -------------------------------------------------
CREATE TABLE IF NOT EXISTS "Users" (
    "UserId"       SERIAL PRIMARY KEY,
    "Username"     VARCHAR(50)  NOT NULL,
    "Email"        VARCHAR(100) NOT NULL,
    "PasswordHash" TEXT         NOT NULL,
    "Role"         VARCHAR(20)  NOT NULL DEFAULT 'User',
    "CreatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT "UQ_Users_Username" UNIQUE ("Username"),
    CONSTRAINT "UQ_Users_Email" UNIQUE ("Email"),
    CONSTRAINT "CHK_Users_Role" CHECK ("Role" IN ('Admin', 'User'))
);

-- 2. Departments -------------------------------------------
CREATE TABLE IF NOT EXISTS "Departments" (
    "DepartmentId"   SERIAL PRIMARY KEY,
    "DepartmentName" VARCHAR(100) NOT NULL,
    "Description"    VARCHAR(500),
    "CreatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT "UQ_Departments_DepartmentName" UNIQUE ("DepartmentName")
);

-- 3. Employees ---------------------------------------------
CREATE TABLE IF NOT EXISTS "Employees" (
    "EmployeeId"    SERIAL PRIMARY KEY,
    "FirstName"     VARCHAR(50)  NOT NULL,
    "LastName"      VARCHAR(50)  NOT NULL,
    "Email"         VARCHAR(100) NOT NULL,
    "Phone"         VARCHAR(20)  NOT NULL,
    "DepartmentId"  INTEGER      NOT NULL,
    "Designation"   VARCHAR(50)  NOT NULL,
    "Salary"        NUMERIC(18,2) NOT NULL,
    "JoiningDate"   TIMESTAMP WITH TIME ZONE NOT NULL,
    "CreatedAt"     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "UpdatedAt"     TIMESTAMP WITH TIME ZONE,

    CONSTRAINT "FK_Employees_Departments_DepartmentId"
        FOREIGN KEY ("DepartmentId")
        REFERENCES "Departments"("DepartmentId")
        ON DELETE RESTRICT,

    CONSTRAINT "UQ_Employees_Email" UNIQUE ("Email")
);

-- 4. Indexes (performance) --------------------------------
CREATE INDEX IF NOT EXISTS "IX_Employees_DepartmentId"
    ON "Employees" ("DepartmentId");

CREATE INDEX IF NOT EXISTS "IX_Employees_LastName"
    ON "Employees" ("LastName");
