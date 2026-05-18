import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/models/auth.service';
import { Toast } from '../../shared/toast/toast';
import { CaisseSessionService } from '../../features/caisse-session/caisse-session.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit, OnDestroy {

   isDarkMode = false;
  hasOpenCaisseSession = false;
  sessionCheckSubscription?: Subscription;

  constructor(private router: Router,
      public authService: AuthService,
        private caisseSessionService: CaisseSessionService


  ) {}

  ngOnInit(): void {

  this.checkCaisseSession();

  this.sessionCheckSubscription = interval(3000)
    .subscribe(() => {
      this.checkCaisseSession();
    });
}

ngOnDestroy(): void {
  this.sessionCheckSubscription?.unsubscribe();
}


  checkCaisseSession(): void {
    this.caisseSessionService.getOpenSession()
      .subscribe({
        next: (session: any) => {
          this.hasOpenCaisseSession = !!session;
        },
        error: () => {
          this.hasOpenCaisseSession = false;
        }
      });
  }

  

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}