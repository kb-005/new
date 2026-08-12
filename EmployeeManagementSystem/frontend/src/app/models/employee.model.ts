export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  departmentId: number;
  departmentName: string;
  designation: string;
  salary: number;
  joiningDate: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: number;
  designation: string;
  salary: number;
  joiningDate: string;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
