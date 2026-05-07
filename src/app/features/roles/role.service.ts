import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = 'http://localhost:8083/api/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions`);
  }

  createRole(data: { name: string; permissions: string[] }): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, data);
  }

  updateRolePermissions(roleId: number, permissions: string[]): Observable<Role> {
    return this.http.put<Role>(
      `${this.apiUrl}/${roleId}/permissions`,
      { permissions }
    );
  }
}