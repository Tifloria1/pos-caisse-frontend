import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8083/api/payments';

  constructor(private http: HttpClient) {}

 payOrder(orderId: number, method: 'ESPECES' | 'CARTE'): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/order/${orderId}?method=${method}`,
    {}
  );
}
}