import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CurrentUser, LoginRequest, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'ems_token';
const USER_KEY = 'ems_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$: Observable<CurrentUser | null> = this.currentUserSubject.asObservable();
  private readonly isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          this.currentUserSubject.next(JSON.parse(stored));
        } catch {
          this.logout();
        }
      }
    }
  }

  login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      }));
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'Admin';
  }

  get currentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  fetchCurrentUser(): Observable<ApiResponse<CurrentUser>> {
    return this.http.get<ApiResponse<CurrentUser>>(`${environment.apiUrl}/auth/me`);
  }

  private setSession(data: LoginResponse): void {
    if (!this.isBrowser) return;
    localStorage.setItem(TOKEN_KEY, data.token);
    const user: CurrentUser = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
