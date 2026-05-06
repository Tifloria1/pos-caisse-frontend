import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8083/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getTopProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-products`);
  }

  getRevenue(): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue`);
  }

  getTodayRevenue() {
  return this.http.get<number>(`${this.apiUrl}/today-revenue`);
}

  getMonthlyRevenue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly-revenue`);
  }

  getLowStock(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/low-stock`);
  }

  getTopUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-users`);
  }

  getTodayOrders() {
  return this.http.get<number>(`${this.apiUrl}/today-orders`);
}

getTodayAverageBasket() {
  return this.http.get<number>(`${this.apiUrl}/today-average-basket`);
}

getProfit() {
  return this.http.get<number>(`${this.apiUrl}/profit`);
}

}