import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaisseSessionService {

  private apiUrl = 'http://localhost:8083/api/caisse-sessions';

  constructor(private http: HttpClient) {}

  getOpenSession(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/open`);
  }

  openSession(openingBalance: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/open?openingBalance=${openingBalance}`,
      {}
    );
  }

  closeSession(closingBalance: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/close?closingBalance=${closingBalance}`,
      {}
    );
  }

  getAllSessions(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}
}