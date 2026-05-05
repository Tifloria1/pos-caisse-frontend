import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8083/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(): Observable<any> {
    return this.http.post(this.apiUrl, {});
  }

  addProductToOrder(orderId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${orderId}/products/${productId}?quantity=${quantity}`,
      {}
    );
  }

  updateProductQuantity(orderId: number, productId: number, quantity: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${orderId}/products/${productId}?quantity=${quantity}`,
      {}
    );
  }

  removeProductFromOrder(orderId: number, productId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${orderId}/products/${productId}`
    );
  }

  getOrders(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}

getOrderById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}
}