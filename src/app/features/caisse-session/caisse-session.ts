import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../core/services/toast.service';
import { CaisseSessionService } from './caisse-session.service';
import { CashMovementService } from './cash-movement.service';
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
  stats: any = null;

  startDate = '';
endDate = '';
selectedSession: any = null;
selectedSessionPayments: any[] = [];

cashMovements: any[] = [];

movementAmount = 0;
movementType = 'IN';
movementReason = '';




  constructor(
    private caisseSessionService: CaisseSessionService,
    private toastService: ToastService,
    private cashMovementService: CashMovementService
  ) {}

  ngOnInit(): void {
    this.loadOpenSession();
    this.loadSessions();
    this.loadStats();
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

loadStats(): void {
  this.caisseSessionService.getStats()
    .subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error(err);
      }
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
          this.loadStats();
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

    this.caisseSessionService.requestCloseSession(this.closingBalance)
      .subscribe({
        next: (session) => {

          this.currentSession = null;

this.toastService.success('Demande de fermeture envoyée');
          this.loading = false;
          this.loadSessions();
          this.loadStats();
        },
        error: (err) => {

          console.error(err);

          this.toastService.error('Erreur fermeture session');

          this.loading = false;
        }
      });
  }

  downloadReport(sessionId: number): void {
  this.caisseSessionService.downloadReportPdf(sessionId);
}

getFilteredSessions(): any[] {
  return this.sessions.filter(session => {

    const openedAt = new Date(session.openedAt).getTime();

    if (this.startDate) {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);

      if (openedAt < start.getTime()) {
        return false;
      }
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);

      if (openedAt > end.getTime()) {
        return false;
      }
    }

    return true;
  });
}
downloadHistoryReport(): void {

  if (!this.startDate || !this.endDate) {
    this.toastService.error('Veuillez choisir une date début et une date fin');
    return;
  }

  this.caisseSessionService.downloadHistoryReportPdf(
    this.startDate,
    this.endDate
  );
}

getDifferenceClass(difference: number): string {
  if (!difference || difference === 0) {
    return 'diff-ok';
  }

  return 'diff-alert';
}

openSessionDetails(session: any): void {
  this.selectedSession = session;
  this.selectedSessionPayments = [];
    this.cashMovements = [];


  this.caisseSessionService.getSessionPayments(session.id)
    .subscribe({
      next: (payments) => {
        this.selectedSessionPayments = payments;
      },
      error: (err) => {
        console.error(err);
      }
    });
      this.loadCashMovements(session.id);

}
closeSessionDetails(): void {
  this.selectedSession = null;
  this.selectedSessionPayments = [];
}

loadCashMovements(sessionId: number): void {
  this.cashMovementService.getBySession(sessionId)
    .subscribe({
      next: (movements) => {
        this.cashMovements = movements;
      },
      error: (err) => {
        console.error(err);
      }
    });
}

addCashMovement(): void {
  if (!this.movementAmount || this.movementAmount <= 0) {
    this.toastService.error('Montant invalide');
    return;
  }

  if (!this.movementReason.trim()) {
    this.toastService.error('Veuillez saisir une raison');
    return;
  }

  this.cashMovementService.addMovement(
    this.movementAmount,
    this.movementType,
    this.movementReason
  ).subscribe({
    next: () => {
      this.toastService.success('Mouvement caisse ajouté');

      this.movementAmount = 0;
      this.movementType = 'IN';
      this.movementReason = '';

      if (this.selectedSession) {
        this.loadCashMovements(this.selectedSession.id);
      }

      this.loadSessions();
      this.loadStats();
    },
    error: (err) => {
      console.error(err);
      this.toastService.error('Erreur ajout mouvement caisse');
    }
  });
}

validateClose(sessionId: number): void {
  this.caisseSessionService.validateCloseSession(sessionId)
    .subscribe({
      next: () => {
        this.toastService.success('Fermeture validée');
        this.loadOpenSession();
        this.loadSessions();
        this.loadStats();
      },
      error: () => {
        this.toastService.error('Erreur validation fermeture');
      }
    });
}

}