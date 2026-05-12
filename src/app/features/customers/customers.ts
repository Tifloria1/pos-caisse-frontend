import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomersService, Customer } from './customers.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {

  customers: Customer[] = [];

  newCustomer = {
    fullName: '',
    phone: '',
    email: '',
    address: ''
  };

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customersService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      }
    });
  }

  createCustomer(): void {

    this.customersService.createCustomer(this.newCustomer).subscribe({
      next: () => {

        this.newCustomer = {
          fullName: '',
          phone: '',
          email: '',
          address: ''
        };

        this.loadCustomers();
      }
    });
  }

  deleteCustomer(id: number): void {

    if (!confirm('Supprimer ce client ?')) {
      return;
    }

    this.customersService.deleteCustomer(id).subscribe({
      next: () => {
        this.loadCustomers();
      }
    });
  }
}