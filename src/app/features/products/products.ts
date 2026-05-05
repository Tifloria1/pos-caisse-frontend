import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from '../../shared/models/product';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../categories/category.service';
import { Category } from '../../shared/models/category';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];

  

  loading = true;
  errorMessage = '';

  showForm = false;
  selectedCategoryId: number | null = null;
  editingProductId: number | null = null;

  newProduct = {
    name: '',
    price: 0,
    barcode: '',
    imageUrl: '',
    stockQuantity: 0,
    active: true
  };
  

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => console.error('Erreur lors du chargement des catégories')
    });
  }

  saveProduct(): void {
    if (!this.selectedCategoryId) {
      alert('Veuillez choisir une catégorie');
      return;
    }

    if (this.editingProductId) {
      this.productService.updateProduct(
        this.editingProductId,
        this.newProduct,
        this.selectedCategoryId
      ).subscribe({
        next: () => {
          alert('Produit modifié avec succès');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.productService.createProduct(
        this.newProduct,
        this.selectedCategoryId
      ).subscribe({
        next: () => {
          alert('Produit ajouté avec succès');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l’ajout du produit');
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.showForm = true;
    this.editingProductId = product.id;

    this.newProduct = {
      name: product.name,
      price: product.price,
      barcode: product.barcode,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      active: product.active ?? product.isActive ?? true
    };

    const category = this.categories.find(c => c.name === product.categoryName);
    this.selectedCategoryId = category ? category.id : null;
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      price: 0,
      barcode: '',
      imageUrl: '',
      stockQuantity: 0,
      active: true
    };

    this.selectedCategoryId = null;
    this.editingProductId = null;
    this.showForm = false;
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

  toggleStatus(product: Product): void {
  this.productService.toggleStatus(product.id).subscribe({
    next: () => {
      this.loadProducts();
    },
    error: () => {
      alert('Erreur lors du changement de statut');
    }
  });
}
}