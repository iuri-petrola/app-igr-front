import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  infoMessage = '';

  constructor(
    private readonly authService: AdminAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/midias']);
      return;
    }

    if (sessionStorage.getItem('admin_session_expired') === '1') {
      this.infoMessage = 'Sessao expirada. Entre novamente.';
      sessionStorage.removeItem('admin_session_expired');
    }
  }

  submit(): void {
    this.errorMessage = '';
    this.infoMessage = '';

    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Informe usuario e senha.';
      return;
    }

    this.authService.login(this.username.trim(), this.password).subscribe({
      next: () => this.router.navigate(['/admin/midias']),
      error: () => {
        this.errorMessage = 'Login invalido.';
      }
    });
  }
}
