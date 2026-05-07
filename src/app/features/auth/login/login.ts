import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/models/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage: string = '';

  loginForm! : any;

  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router

  ) {
     this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  }

   login(): void {
  if (this.loginForm.invalid) {
    this.errorMessage = 'Please enter a valid email and password';
    return;
  }

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      this.authService.saveToken(response.token);
      this.authService.saveRole(response.role);
      this.authService.savePermissions(response.permissions || []);
      this.authService.saveUserId(response.id);

      if (response.permissions?.includes('DASHBOARD_VIEW')) {
        this.router.navigate(['/dashboard']);
      } else if (response.permissions?.includes('POS_ACCESS')) {
        this.router.navigate(['/orders']);

      } else if (response.permissions?.includes('ORDER_VIEW')) {

        this.router.navigate(['/commands']);
      } else {
        this.router.navigate(['/login']);
      }
    },
    error: () => {
      this.errorMessage = 'Invalid email or password';
    }
  });
}


}
