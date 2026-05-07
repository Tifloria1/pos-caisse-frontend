import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { InvoiceService } from './invoice.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../shared/models/auth.service';
@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './orders-history.html',
  styleUrls: ['./orders-history.css']
})
export class OrdersHistory implements OnInit {

  orders: any[] = [];
  loading = true;
  errorMessage = '';
  selectedOrder: any = null;

  searchText = '';
selectedStatus = 'ALL';




  constructor(
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private toastService : ToastService,
    public authService: AuthService
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


  getFilteredOrders(): any[] {
  return this.orders.filter(order => {
    const matchesSearch =
      order.id.toString().includes(this.searchText);

    const matchesStatus =
      this.selectedStatus === 'ALL' ||
      order.status === this.selectedStatus;

    return matchesSearch && matchesStatus;
  });
}


exportOrdersCsv(): void {
  const ordersToExport = this.getFilteredOrders();

  if (ordersToExport.length === 0) {
    this.toastService.info('Aucune commande à exporter');
    return;
  }

  const headers = ['ID', 'Date', 'Statut', 'Total', 'Nb articles'];

  const rows = ordersToExport.map(order => [
    order.id,
    order.createdAt || order.orderDate || '',
    order.status,
    order.totalAmount || 0,
    order.items?.length || 0
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'orders-history.csv';
  link.click();

  window.URL.revokeObjectURL(url);
  this.toastService.success('Export CSV effectué avec succès');
}
}