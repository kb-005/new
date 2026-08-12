export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  username: string;
  email: string;
  role: string;
  userId: number;
}

export interface CurrentUser {
  userId: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export type UserRole = 'Admin' | 'User';
