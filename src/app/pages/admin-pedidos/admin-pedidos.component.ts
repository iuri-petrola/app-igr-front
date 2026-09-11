import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { MediaApiService, PedidoAdminItem } from '../../services/media-api.service';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.scss']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: PedidoAdminItem[] = [];
  errorMessage = '';

  constructor(
    private readonly mediaApiService: MediaApiService,
    private readonly authService: AdminAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.errorMessage = '';
    this.mediaApiService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar pedidos.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
