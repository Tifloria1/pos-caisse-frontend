import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private apiUrl = 'http://localhost:8083/api/tables';

  constructor(private http: HttpClient) {}

  getTables() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTable(table: any) {
    return this.http.post(this.apiUrl, table);
  }

  updateTableStatus(tableId: number, status: string) {
    return this.http.patch(
      `${this.apiUrl}/${tableId}/status?status=${status}`,
      {}
    );
  }

  deleteTable(tableId: number) {
    return this.http.delete(`${this.apiUrl}/${tableId}`);
  }
}