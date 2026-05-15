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

getStats(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/stats`);
}

downloadReportPdf(sessionId: number): void {
  this.http.get(
    `${this.apiUrl}/${sessionId}/report/pdf`,
    { responseType: 'blob' }
  ).subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  });
}

downloadHistoryReportPdf(startDate: string, endDate: string): void {
  this.http.get(
    `${this.apiUrl}/report/pdf?startDate=${startDate}&endDate=${endDate}`,
    { responseType: 'blob' }
  ).subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  });
}
}