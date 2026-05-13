import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8083/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(customerId?: number | null): Observable<any> {

  let url = this.apiUrl;

  if (customerId) {
    url += `?customerId=${customerId}`;
  }

  return this.http.post(url, {});
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


getPreparationTicketsPreview(orderId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/${orderId}/preparation-tickets-preview`
  );
}

updateKitchenTicketStatus(ticketId: number, status: string) {
  return this.http.patch(
    `http://localhost:8083/api/kitchen-tickets/${ticketId}/status?status=${status}`,
    {}
  );
}

getKitchenTicketsByOrder(orderId: number) {
  return this.http.get<any[]>(
    `http://localhost:8083/api/kitchen-tickets/order/${orderId}`
  );
}

getKitchenTicketsByDestination(destination: string) {
  return this.http.get<any[]>(
    `http://localhost:8083/api/kitchen-tickets/destination/${destination}`
  );
}

}