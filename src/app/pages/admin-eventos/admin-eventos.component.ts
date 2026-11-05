import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { EventoApiService, EventoItem, UsuarioItem } from '../../services/evento-api.service';

@Component({
  selector: 'app-admin-eventos',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-eventos.component.html',
  styleUrls: ['./admin-eventos.component.scss']
})
export class AdminEventosComponent implements OnInit {
  eventos: EventoItem[] = [];
  usuarios: UsuarioItem[] = [];
  eventoForm = { titulo: '', descricao: '', local: '', dataEvento: '', prazoInscricao: '' };
  usuarioForm = { nome: '', celular: '', email: '' };
  feedbackEvento = '';
  feedbackUsuario = '';
  erroEvento = false;
  erroUsuario = false;

  constructor(
    private readonly eventoApi: EventoApiService,
    private readonly authService: AdminAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
    this.carregarUsuarios();
  }

  salvarEvento(): void {
    if (!this.eventoForm.titulo.trim() || !this.eventoForm.dataEvento) {
      this.mostrarFeedbackEvento('Preencha o título e a data do evento.', true);
      return;
    }

    this.eventoApi.createEvento({
      titulo: this.eventoForm.titulo.trim(),
      descricao: this.eventoForm.descricao.trim(),
      local: this.eventoForm.local.trim(),
      dataEvento: new Date(this.eventoForm.dataEvento).toISOString(),
      prazoInscricao: this.eventoForm.prazoInscricao
        ? new Date(this.eventoForm.prazoInscricao).toISOString()
        : null
    }).subscribe({
      next: () => {
        this.eventoForm = { titulo: '', descricao: '', local: '', dataEvento: '', prazoInscricao: '' };
        this.mostrarFeedbackEvento('Evento criado e formulário de inscrição publicado.', false);
        this.carregarEventos();
      },
      error: (response: HttpErrorResponse) => {
        this.mostrarFeedbackEvento(response.error?.error || 'Erro ao criar evento.', true);
      }
    });
  }

  salvarUsuario(): void {
    if (!this.usuarioForm.nome.trim() || !this.usuarioForm.celular.trim()) {
      this.mostrarFeedbackUsuario('Preencha o nome e o celular.', true);
      return;
    }

    this.eventoApi.createUsuario({
      nome: this.usuarioForm.nome.trim(),
      celular: this.usuarioForm.celular.trim(),
      email: this.usuarioForm.email.trim()
    }).subscribe({
      next: () => {
        this.usuarioForm = { nome: '', celular: '', email: '' };
        this.mostrarFeedbackUsuario('Usuário cadastrado com sucesso.', false);
        this.carregarUsuarios();
      },
      error: (response: HttpErrorResponse) => {
        this.mostrarFeedbackUsuario(response.error?.error || 'Erro ao cadastrar usuário.', true);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  private carregarEventos(): void {
    this.eventoApi.getEventosAdmin().subscribe({
      next: (eventos) => (this.eventos = eventos),
      error: () => this.mostrarFeedbackEvento('Erro ao carregar eventos.', true)
    });
  }

  private carregarUsuarios(): void {
    this.eventoApi.getUsuariosAdmin().subscribe({
      next: (usuarios) => (this.usuarios = usuarios),
      error: () => this.mostrarFeedbackUsuario('Erro ao carregar usuários.', true)
    });
  }

  private mostrarFeedbackEvento(mensagem: string, erro: boolean): void {
    this.feedbackEvento = mensagem;
    this.erroEvento = erro;
  }

  private mostrarFeedbackUsuario(mensagem: string, erro: boolean): void {
    this.feedbackUsuario = mensagem;
    this.erroUsuario = erro;
  }
}
