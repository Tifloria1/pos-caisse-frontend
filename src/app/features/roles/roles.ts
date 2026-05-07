import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role, Permission, RoleService } from './role.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})
export class Roles implements OnInit {

  roles: Role[] = [];
  permissions: Permission[] = [];

  newRoleName = '';
  selectedPermissions: string[] = [];

  selectedRole: Role | null = null;
  editingPermissions: string[] = [];

  constructor(
    private roleService: RoleService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: () => this.toastService.error('Erreur lors du chargement des rôles')
    });
  }

  loadPermissions(): void {
    this.roleService.getPermissions().subscribe({
      next: (data) => this.permissions = data,
      error: () => this.toastService.error('Erreur lors du chargement des permissions')
    });
  }

  togglePermission(permissionName: string, target: string[]): void {
    const index = target.indexOf(permissionName);

    if (index >= 0) {
      target.splice(index, 1);
    } else {
      target.push(permissionName);
    }
  }

  createRole(): void {
    if (!this.newRoleName.trim()) {
      this.toastService.error('Nom du rôle obligatoire');
      return;
    }

    this.roleService.createRole({
      name: this.newRoleName,
      permissions: this.selectedPermissions
    }).subscribe({
      next: () => {
        this.toastService.success('Rôle créé avec succès');
        this.newRoleName = '';
        this.selectedPermissions = [];
        this.loadRoles();
      },
      error: () => this.toastService.error('Erreur lors de la création du rôle')
    });
  }

  editRole(role: Role): void {
    this.selectedRole = role;
    this.editingPermissions = role.permissions.map(p => p.name);
  }

  updatePermissions(): void {
    if (!this.selectedRole) return;

    this.roleService.updateRolePermissions(
      this.selectedRole.id,
      this.editingPermissions
    ).subscribe({
      next: () => {
        this.toastService.success('Permissions mises à jour');
        this.selectedRole = null;
        this.editingPermissions = [];
        this.loadRoles();
      },
      error: () => this.toastService.error('Erreur lors de la mise à jour')
    });
  }

  cancelEdit(): void {
    this.selectedRole = null;
    this.editingPermissions = [];
  }
}