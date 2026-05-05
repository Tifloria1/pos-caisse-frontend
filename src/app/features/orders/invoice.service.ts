import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'http://localhost:8083/api/invoices';

  constructor(private http: HttpClient) {}

  downloadInvoicePdf(orderId: number): void {
    this.http.get(`${this.apiUrl}/order/${orderId}/pdf`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      },
      error: () => {
        alert('Erreur lors du téléchargement de la facture');
      }
    });
  }
}