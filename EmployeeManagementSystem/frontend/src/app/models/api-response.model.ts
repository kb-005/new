/** Consistent envelope returned by every backend endpoint. */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}
