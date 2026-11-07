import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import {
  EventoApiService,
  EventoItem,
  InscricaoEventoItem,
  UsuarioItem
} from '../../services/evento-api.service';

@Component({
  selector: 'app-admin-eventos',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-eventos.component.html',
  styleUrls: ['./admin-eventos.component.scss']
})
export class AdminEventosComponent implements OnInit {
  eventos: EventoItem[] = [];
  usuarios: UsuarioItem[] = [];
  inscricoes: InscricaoEventoItem[] = [];
  eventoForm = { titulo: '', descricao: '', local: '', dataEvento: '', prazoInscricao: '' };
  usuarioForm = { nome: '', celular: '', email: '' };
  eventoInscricoesId = 0;
  feedbackEvento = '';
  feedbackUsuario = '';
  erroEvento = false;
  erroUsuario = false;
  feedbackLink = '';
  carregandoInscricoes = false;
  erroInscricoes = '';

  constructor(
    private readonly eventoApi: EventoApiService,
    private readonly authService: AdminAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
    this.carregarUsuarios();
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

  carregarInscricoes(): void {
    this.inscricoes = [];
    this.erroInscricoes = '';

    if (!this.eventoInscricoesId) {
      return;
    }

    this.carregandoInscricoes = true;
    this.eventoApi.getInscricoesEvento(this.eventoInscricoesId).subscribe({
      next: (inscricoes) => {
        this.inscricoes = inscricoes;
        this.carregandoInscricoes = false;
      },
      error: (response: HttpErrorResponse) => {
        this.erroInscricoes = response.error?.error || 'Erro ao carregar inscritos.';
        this.carregandoInscricoes = false;
      }
    });
  }

  async copiarLinkEvento(evento: EventoItem): Promise<void> {
    if (!evento.linkInscricao) {
      return;
    }

    try {
      await navigator.clipboard.writeText(evento.linkInscricao);
      this.feedbackLink = `Link de ${evento.titulo} copiado.`;
    } catch (_error) {
      this.feedbackLink = 'Não foi possível copiar o link.';
    }
  }

  compartilharEvento(evento: EventoItem): void {
    if (!evento.linkInscricao) {
      return;
    }

    const mensagem = [
      `Inscrições para o evento ${evento.titulo}.`,
      'Abra o link e informe os nomes dos participantes:',
      evento.linkInscricao
    ].join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
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
