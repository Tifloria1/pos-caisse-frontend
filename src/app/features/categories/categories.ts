import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../shared/models/category';
import { CategoryService } from './category.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../shared/models/auth.service';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class Categories implements OnInit {

  categories: Category[] = [];
  loading = true;
  errorMessage = '';

  newCategory = {
    name: ''
  };

  constructor(private categoryService: CategoryService, private toastService: ToastService , public authService: AuthService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des catégories';
        this.loading = false;
      }
    });
  }

  createCategory(): void {
    if (!this.newCategory.name.trim()) {
      alert('Veuillez entrer le nom de la catégorie');
      return;
    }

    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.toastService.success('Catégorie ajoutée avec succès');
        this.newCategory.name = '';
        this.loadCategories();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erreur lors de l’ajout de la catégorie');
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(category => category.id !== id);
        },
        error: () => {
          this.toastService.error('Erreur lors de la suppression. Cette catégorie contient peut-être des produits.');
        }
      });
    }
  }
}