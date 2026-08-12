import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DepartmentReportRow, EmployeeReportRow } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly base = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getEmployeesReport(departmentId?: number | null): Observable<ApiResponse<EmployeeReportRow[]>> {
    let params = new HttpParams();
    if (departmentId) params = params.set('departmentId', departmentId.toString());
    return this.http.get<ApiResponse<EmployeeReportRow[]>>(`${this.base}/employees`, { params });
  }

  getDepartmentsReport(): Observable<ApiResponse<DepartmentReportRow[]>> {
    return this.http.get<ApiResponse<DepartmentReportRow[]>>(`${this.base}/departments`);
  }
}
