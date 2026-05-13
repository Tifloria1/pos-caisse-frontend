import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from '../orders/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-kitchen-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kitchen-screen.html',
  styleUrls: ['./kitchen-screen.css']
})
export class KitchenScreen implements OnInit {

  @Input() destination: 'CUISINE' | 'BAR' | 'PATISSERIE' = 'CUISINE';
  @Input() title = 'Kitchen Screen';

  tickets: any[] = [];
  loading = false;

  constructor(
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;

    this.orderService.getKitchenTicketsByDestination(this.destination)
      .subscribe({
        next: (data) => {
          this.tickets = data.filter(ticket => ticket.status !== 'DELIVERED');
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Erreur lors du chargement des tickets');
          this.loading = false;
        }
      });
  }

  updateStatus(ticketId: number, status: string): void {
    this.orderService.updateKitchenTicketStatus(ticketId, status)
      .subscribe({
        next: () => {
          this.toastService.success('Ticket mis à jour');
          this.loadTickets();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Erreur lors du changement de statut');
        }
      });
  }
}