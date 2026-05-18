import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashMovementService {

  private apiUrl = 'http://localhost:8083/api/cash-movements';

  constructor(private http: HttpClient) {}

  addMovement(
    amount: number,
    type: string,
    reason: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('amount', amount)
      .set('type', type)
      .set('reason', reason);

    return this.http.post(this.apiUrl, {}, { params });
  }

  getBySession(sessionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/session/${sessionId}`
    );
  }
}