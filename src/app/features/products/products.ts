import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products  implements OnInit {
    products: Product[] = [];
  loading = true;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.loading = false;
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== id);
        },
        error: () => {
          alert('Erreur lors de la suppression');
        }
      });
    }
  }





}
