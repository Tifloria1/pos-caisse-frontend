import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone:  true,
  imports: [ CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  stats: any;
  revenue: any;
  topProducts: any[] = [];
  monthlyRevenue: any[] = [];
  lowStock: any[] = [];
  topUsers: any[] = [];

  loading = true;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des statistiques';
      }
    });

    this.dashboardService.getRevenue().subscribe({
      next: (data) => {
        this.revenue = data;
      }
    });

    this.dashboardService.getTopProducts().subscribe({
      next: (data) => {
        this.topProducts = data;
      }
    });

    this.dashboardService.getMonthlyRevenue().subscribe({
      next: (data) => {
        this.monthlyRevenue = data;
      }
    });

    this.dashboardService.getLowStock().subscribe({
      next: (data) => {
        this.lowStock = data;
      }
    });

    this.dashboardService.getTopUsers().subscribe({
      next: (data) => {
        this.topUsers = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}