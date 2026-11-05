import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import {
  ConviteGerado,
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
  conviteForm = { eventoId: 0, usuarioId: 0 };
  eventoInscricoesId = 0;
  conviteGerado: ConviteGerado | null = null;
  feedbackEvento = '';
  feedbackUsuario = '';
  erroEvento = false;
  erroUsuario = false;
  feedbackConvite = '';
  erroConvite = false;
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

  gerarConvite(): void {
    if (!this.conviteForm.eventoId || !this.conviteForm.usuarioId) {
      this.mostrarFeedbackConvite('Selecione o evento e o usuário.', true);
      return;
    }

    this.conviteGerado = null;
    this.eventoApi.createConvite(this.conviteForm.eventoId, this.conviteForm.usuarioId).subscribe({
      next: (convite) => {
        this.conviteGerado = convite;
        this.mostrarFeedbackConvite('Link individual gerado com sucesso.', false);
      },
      error: (response: HttpErrorResponse) => {
        this.mostrarFeedbackConvite(response.error?.error || 'Erro ao gerar convite.', true);
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

  async copiarConvite(): Promise<void> {
    if (!this.conviteGerado) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.conviteGerado.conviteUrl);
      this.mostrarFeedbackConvite('Link copiado.', false);
    } catch (_error) {
      this.mostrarFeedbackConvite('Não foi possível copiar. Selecione o link manualmente.', true);
    }
  }

  enviarConviteWhatsApp(): void {
    if (!this.conviteGerado) {
      return;
    }

    const celular = this.conviteGerado.usuario.celular.replace(/\D/g, '');
    const numero = celular.startsWith('55') ? celular : `55${celular}`;
    const mensagem = [
      `Olá, ${this.conviteGerado.usuario.nome}!`,
      `Você foi convidado para o evento ${this.conviteGerado.evento.titulo}.`,
      'Abra o link e confirme sua inscrição:',
      this.conviteGerado.conviteUrl
    ].join('\n');

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
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

  private mostrarFeedbackConvite(mensagem: string, erro: boolean): void {
    this.feedbackConvite = mensagem;
    this.erroConvite = erro;
  }
}
