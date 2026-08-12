export interface Department {
  departmentId: number;
  departmentName: string;
  description?: string | null;
  createdAt: string;
  employeeCount: number;
}

export interface CreateDepartmentRequest {
  departmentName: string;
  description?: string | null;
}

export interface UpdateDepartmentRequest {
  departmentName: string;
  description?: string | null;
}
