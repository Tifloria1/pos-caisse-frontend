import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../core/services/toast.service';
import { Role, RoleService } from '../roles/role.service';
import { User, UserService } from './user.service';
import { AuthService } from '../../shared/models/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users implements OnInit {

  users: User[] = [];
  roles: Role[] = [];

  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'CAISSIER'
  };

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private toastService: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        this.toastService.error('Erreur lors du chargement des utilisateurs');
      }
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      }
    });
  }

  createUser(): void {

    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.toastService.error('Tous les champs sont obligatoires');
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.toastService.success('Utilisateur créé avec succès');

        this.newUser = {
          name: '',
          email: '',
          password: '',
          role: 'CAISSIER'
        };

        this.loadUsers();
      },
      error: () => {
        this.toastService.error('Erreur lors de la création');
      }
    });
  }

  changeRole(user: User, event: Event): void {

    const target = event.target as HTMLSelectElement;

    this.userService.updateUserRole(user.id, target.value).subscribe({
      next: () => {
        this.toastService.success('Rôle mis à jour');
        this.loadUsers();
      },
      error: () => {
        this.toastService.error('Erreur lors de la mise à jour');
      }
    });
  }

  deleteUser(userId: number): void {

    if (!confirm('Supprimer cet utilisateur ?')) {
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.toastService.success('Utilisateur supprimé');
        this.loadUsers();
      },
      error: () => {
        this.toastService.error('Erreur lors de la suppression');
      }
    });
  }

  isCurrentUser(userId: number): boolean {
  return this.authService.getUserId() === userId;
}
}