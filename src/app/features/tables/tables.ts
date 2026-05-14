import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../core/services/toast.service';
import { TableService } from './table.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tables.html',
  styleUrl: './tables.css'
})
export class Tables implements OnInit {

  tables: any[] = [];

  newTable = {
    tableNumber: '',
    capacity: 4
  };

  loading = false;

  constructor(
    private tableService: TableService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.loading = true;

    this.tableService.getTables()
      .subscribe({
        next: (data) => {
          this.tables = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Erreur chargement tables');
          this.loading = false;
        }
      });
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
}