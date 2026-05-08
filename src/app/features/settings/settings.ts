import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService, StoreSettings } from './settings.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings implements OnInit {

  settings: StoreSettings = {
    storeName: '',
    phone: '',
    address: '',
    email: ''
  };

  loading = false;

  constructor(
    private settingsService: SettingsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;

    this.settingsService.getSettings().subscribe({
      next: (data) => {
        this.settings = data;
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Erreur lors du chargement des paramètres');
        this.loading = false;
      }
    });
  }

  saveSettings(): void {
    if (!this.settings.storeName.trim()) {
      this.toastService.error('Le nom du magasin est obligatoire');
      return;
    }

    this.settingsService.updateSettings(this.settings).subscribe({
      next: (data) => {
        this.settings = data;
        this.toastService.success('Paramètres enregistrés');
      },
      error: () => {
        this.toastService.error('Erreur lors de l’enregistrement');
      }
    });
  }
}