import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../core/services/toast.service';
import { CaisseSessionService } from './caisse-session.service';

@Component({
  selector: 'app-caisse-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caisse-session.html',
  styleUrl: './caisse-session.css'
})
export class CaisseSession implements OnInit {

  currentSession: any = null;

  openingBalance = 0;
  closingBalance = 0;

  loading = false;

  sessions: any[] = [];

  constructor(
    private caisseSessionService: CaisseSessionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOpenSession();
    this.loadSessions();
  }

  loadOpenSession(): void {

    this.caisseSessionService.getOpenSession()
      .subscribe({
        next: (data) => {
          this.currentSession = data;
        },
        error: () => {
          this.currentSession = null;
        }
      });
  }

  loadSessions(): void {
  this.caisseSessionService.getAllSessions()
    .subscribe({
      next: (data) => this.sessions = data,
      error: (err) => console.error(err)
    });
}

  openSession(): void {

    this.loading = true;

    this.caisseSessionService
      .openSession(this.openingBalance)
      .subscribe({
        next: (data) => {

          this.currentSession = data;

          this.toastService.success('Session caisse ouverte');

          this.loading = false;
          this.loadSessions();
        },
        error: (err) => {

          console.error(err);

          this.toastService.error('Erreur ouverture session');

          this.loading = false;
        }
      });
  }

  closeSession(): void {

    this.loading = true;

    this.caisseSessionService
      .closeSession(this.closingBalance)
      .subscribe({
        next: (session) => {

          this.currentSession = null;

          this.toastService.success('Session caisse fermée');

          this.loading = false;
          this.loadSessions();
        },
        error: (err) => {

          console.error(err);

          this.toastService.error('Erreur fermeture session');

          this.loading = false;
        }
      });
  }
}