import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  CreateEmployeeRequest,
  Employee,
  PagedResult,
  UpdateEmployeeRequest
} from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly base = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getPaged(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    departmentId?: number | null;
    sortBy?: string;
    sortDescending?: boolean;
  }): Observable<ApiResponse<PagedResult<Employee>>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', (params.page ?? 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize ?? 10).toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.departmentId) httpParams = httpParams.set('departmentId', params.departmentId.toString());
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDescending !== undefined)
      httpParams = httpParams.set('sortDescending', params.sortDescending.toString());

    return this.http.get<ApiResponse<PagedResult<Employee>>>(this.base, { params: httpParams });
  }

  getAll(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(this.base);
  }

  search(query: string): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.base}/search`, {
      params: new HttpParams().set('query', query)
    });
  }

  getById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.base}/${id}`);
  }

  create(payload: CreateEmployeeRequest): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.base, payload);
  }

  update(id: number, payload: UpdateEmployeeRequest): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.base}/${id}`);
  }
}
