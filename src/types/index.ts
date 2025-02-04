export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
