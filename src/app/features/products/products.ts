import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from '../../shared/models/product';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../categories/category.service';
import { Category } from '../../shared/models/category';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../shared/models/auth.service';
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

  searchText = '';
  selectedFilterCategoryId: number | null = null;
  selectedStatus = 'ALL';

  

  loading = true;
  errorMessage = '';

  showForm = false;
  selectedCategoryId: number | null = null;
  editingProductId: number | null = null;

  selectedImageFile: File | null = null;

  newProduct = {
    name: '',
    price: 0,
    costPrice: 0,
    barcode: '',
    imageUrl: '',
    stockQuantity: 0,
    active: true,
    destination: 'NONE' 
  };
  
  

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastService: ToastService,
    public authService: AuthService
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
    this.toastService.error('Veuillez choisir une catégorie');
    return;
  }

  const productToSave = {
    ...this.newProduct,
    isActive: this.newProduct.active
  };

  if (this.editingProductId) {
    this.productService.updateProduct(
      this.editingProductId,
      productToSave,
      this.selectedCategoryId
    ).subscribe({
      next: (savedProduct) => {
        if (this.selectedImageFile && savedProduct.id) {
          this.productService.uploadProductImage(savedProduct.id, this.selectedImageFile).subscribe({
            next: () => {
              this.toastService.success('Produit modifié avec image');
              this.resetForm();
              this.loadProducts();
            },
            error: () => {
              this.toastService.error('Produit modifié, mais erreur image');
              this.resetForm();
              this.loadProducts();
            }
          });
        } else {
          this.toastService.success('Produit modifié avec succès');
          this.resetForm();
          this.loadProducts();
        }
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erreur lors de la modification');
      }
    });
  } else {
    this.productService.createProduct(
      productToSave,
      this.selectedCategoryId
    ).subscribe({
      next: (savedProduct) => {
        if (this.selectedImageFile && savedProduct.id) {
          this.productService.uploadProductImage(savedProduct.id, this.selectedImageFile).subscribe({
            next: () => {
              this.toastService.success('Produit ajouté avec image');
              this.resetForm();
              this.loadProducts();
            },
            error: () => {
              this.toastService.error('Produit ajouté, mais erreur image');
              this.resetForm();
              this.loadProducts();
            }
          });
        } else {
          this.toastService.success('Produit ajouté avec succès');
          this.resetForm();
          this.loadProducts();
        }
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erreur lors de l’ajout du produit');
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
      costPrice: product.costPrice || 0,
      barcode: product.barcode,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      active: product.active ?? product.isActive ?? true,
      destination: product.destination || 'NONE'
    };

    const category = this.categories.find(c => c.name === product.categoryName);
    this.selectedCategoryId = category ? category.id : null;
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      price: 0,
      costPrice: 0,
      barcode: '',
      imageUrl: '',
      stockQuantity: 0,
      active: true,
      destination: 'NONE'
    };

    this.selectedCategoryId = null;
    this.editingProductId = null;
    this.selectedImageFile = null;
    this.showForm = false;
  }

  deleteProduct(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== id);
        },
        error: () => {
          this.toastService.error('Erreur lors de la suppression');
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

getFilteredProducts(): Product[] {
  return this.products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(this.searchText.toLowerCase());

    const matchesCategory =
      !this.selectedFilterCategoryId ||
      this.categories.find(c => c.id === this.selectedFilterCategoryId)?.name === product.categoryName;

    const isActive = product.active ?? product.isActive ?? false;

    const matchesStatus =
      this.selectedStatus === 'ALL' ||
      (this.selectedStatus === 'ACTIVE' && isActive) ||
      (this.selectedStatus === 'INACTIVE' && !isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.selectedImageFile = input.files[0];
  }
}
}