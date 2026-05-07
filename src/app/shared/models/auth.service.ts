import { Injectable } from "@angular/core";
import { AuthResponse, LoginRequest, RegisterRequest } from "./auth";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private apiUrl = 'http://localhost:8083/api/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveRole(role: string): void {
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  savePermissions(permissions: string[]): void {
    localStorage.setItem('permissions', JSON.stringify(permissions));
  }

  getPermissions(): string[] {
    const permissions = localStorage.getItem('permissions');
    return permissions ? JSON.parse(permissions) : [];
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('permissions');
    localStorage.removeItem('userId');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isCaissier(): boolean {
    return this.getRole() === 'CAISSIER';
  }

  saveUserId(id: number): void {
  localStorage.setItem('userId', id.toString());
}

getUserId(): number | null {
  const id = localStorage.getItem('userId');
  return id ? Number(id) : null;
}
}