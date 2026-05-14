import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../core/services/toast.service';
import { TableService } from './table.service';
import { interval, Subscription } from 'rxjs';
import { PaymentService } from '../orders/payment.service';
import { InvoiceService } from '../orders/invoice.service';



@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tables.html',
  styleUrl: './tables.css'

  
})
export class Tables implements OnInit, OnDestroy {

  tables: any[] = [];

  newTable = {
    tableNumber: '',
    capacity: 4
  };

  loading = false;
  private refreshSubscription?: Subscription;

  selectedOrder: any = null;
showOrderModal = false;

  constructor(
    private tableService: TableService,
    private toastService: ToastService,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService
    

  ) {}

  ngOnInit(): void {
  this.loadTables();

  this.refreshSubscription = interval(60000).subscribe(() => {
    this.loadTables();
  });
}

ngOnDestroy(): void {
  this.refreshSubscription?.unsubscribe();
}

  loadTables(): void {
    this.loading = true;

    this.tableService.getTables()
      .subscribe({
        next: (data) => {
          this.tables = data;
          this.loadOccupiedDurations();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Erreur chargement tables');
          this.loading = false;
        }
      });
  }
   loadOccupiedDurations(): void {

    this.tables.forEach(table => {

      if (table.status === 'OCCUPIED') {

        this.tableService.getActiveOrder(table.id)
          .subscribe({
            next: (order) => {

              if (order?.createdAt) {

                const created = new Date(order.createdAt).getTime();

                const now = new Date().getTime();

                const diffMinutes = Math.floor(
                  (now - created) / 60000
                );

                table.occupiedMinutes = diffMinutes;
              }
            },
            error: () => {}
          });
      }
    });
  }

  openTableOrder(tableId: number): void {

  this.tableService.getActiveOrder(tableId)
    .subscribe({
      next: (order) => {

        this.selectedOrder = order;

        this.showOrderModal = true;
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Aucune commande active');
      }
    });
}

closeModal(): void {
  this.showOrderModal = false;
  this.selectedOrder = null;
}

  createTable(): void {

    if (!this.newTable.tableNumber.trim()) {
      this.toastService.error('Numéro table obligatoire');
      return;
    }

    this.tableService.createTable(this.newTable)
      .subscribe({
        next: () => {
          this.toastService.success('Table créée');

          this.newTable = {
            tableNumber: '',
            capacity: 4
          };

          this.loadTables();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Erreur création table');
        }
      });
  }

  updateStatus(tableId: number, status: string): void {
    this.tableService.updateTableStatus(tableId, status)
      .subscribe({
        next: () => {
          this.toastService.success('Statut mis à jour');
          this.loadTables();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Erreur changement statut');
        }
      });
  }

  deleteTable(tableId: number): void {
  const confirmed = confirm('Voulez-vous vraiment supprimer cette table ?');

  if (!confirmed) {
    return;
  }

  this.tableService.deleteTable(tableId)
    .subscribe({
      next: () => {
        this.toastService.success('Table supprimée');
        this.loadTables();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erreur suppression');
      }
    });
}


paySelectedOrder(): void {
  if (!this.selectedOrder) {
    return;
  }

  this.paymentService.payOrder(this.selectedOrder.id, 'ESPECES')
    .subscribe({
      next: () => {
        this.toastService.success('Commande payée avec succès');

        this.invoiceService.downloadInvoicePdf(this.selectedOrder.id);

        this.closeModal();
        this.loadTables();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erreur lors du paiement');
      }
    });
}
}