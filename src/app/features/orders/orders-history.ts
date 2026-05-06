import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-history.html',
  styleUrls: ['./orders-history.css']
})
export class OrdersHistory implements OnInit {

  orders: any[] = [];
  loading = true;
  errorMessage = '';
  selectedOrder: any = null;


  constructor(
    private orderService: OrderService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;

    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement des commandes';
        this.loading = false;
      }
    });
  }
openDetails(order: any): void {
  this.selectedOrder = order;
}

closeDetails(): void {
  this.selectedOrder = null;
}

  downloadInvoice(orderId: number): void {
    this.invoiceService.downloadInvoicePdf(orderId);
  }
}