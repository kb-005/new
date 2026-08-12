export interface EmployeeReportRow {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentName: string;
  designation: string;
  salary: number;
  joiningDate: string;
}

export interface DepartmentReportRow {
  departmentId: number;
  departmentName: string;
  description?: string | null;
  employeeCount: number;
  totalSalary: number;
  averageSalary: number;
}
