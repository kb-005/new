export interface EmployeesPerDepartment {
  departmentId: number;
  departmentName: string;
  employeeCount: number;
}

export interface RecentEmployee {
  employeeId: number;
  fullName: string;
  departmentName: string;
  designation: string;
  joiningDate: string;
}

export interface DashboardSummary {
  totalEmployees: number;
  totalDepartments: number;
  newEmployeesThisMonth: number;
  totalSalaryExpense: number;
  employeesPerDepartment: EmployeesPerDepartment[];
  recentlyJoined: RecentEmployee[];
}
