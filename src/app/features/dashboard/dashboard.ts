import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone:  true,
  imports: [ CommonModule , BaseChartDirective],
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
  chartLabels: string[] = [];
  chartData: number[] = [];

  pieLabels: string[] = [];
  pieData: number[] = [];

  lineLabels: string[] = [];
  lineData: number[] = [];

  todayRevenue = 0;

  todayOrders = 0;
todayAverageBasket = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard(
      
  
    );
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
    console.log('DAILY REVENUE:', data);

    this.revenue = data;

    this.lineLabels = data.map((item: any) => item.date);
    this.lineData = data.map((item: any) => item.total);
  }
});

this.dashboardService.getTodayRevenue().subscribe({
  next: (data) => {
    this.todayRevenue = data;
  },
  error: (err) => {
    console.error('TODAY REVENUE ERROR:', err);
  }
});

this.dashboardService.getTodayOrders().subscribe({
  next: (data) => {
    this.todayOrders = data;
  }
});

this.dashboardService.getTodayAverageBasket().subscribe({
  next: (data) => {
    this.todayAverageBasket = data;
  }
});

this.dashboardService.getTopProducts().subscribe({
  next: (data) => {
    this.topProducts = data;

    this.pieLabels = data.map((item: any) => item.productName);
    this.pieData = data.map((item: any) => item.totalSold);
  }
});

    this.dashboardService.getMonthlyRevenue().subscribe({
  next: (data) => {
    this.monthlyRevenue = data;

    this.chartLabels = data.map((item: any) => item.month);
    this.chartData = data.map((item: any) => item.total);
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