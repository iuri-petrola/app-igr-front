import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventoApiService, EventoItem, UsuarioResumo } from '../../services/evento-api.service';

type ParticipanteForm = {
  nome: string;
  usuarioId: number | null;
  sugestoes: UsuarioResumo[];
  pesquisando: boolean;
};

@Component({
  selector: 'app-inscricao-evento',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inscricao-evento.component.html',
  styleUrls: ['./inscricao-evento.component.scss']
})
export class InscricaoEventoComponent implements OnInit, OnDestroy {
  evento: EventoItem | null = null;
  participantes: ParticipanteForm[] = [this.criarParticipante()];
  carregando = true;
  enviando = false;
  mensagem = '';
  erro = '';
  private readonly buscaTimers: Array<ReturnType<typeof setTimeout> | undefined> = [];
  private mensagemTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventoApi: EventoApiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.erro = 'Evento inválido.';
      this.carregando = false;
      return;
    }

    this.eventoApi.getEvento(id).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Evento não encontrado.';
        this.carregando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.buscaTimers.forEach((timer) => timer && clearTimeout(timer));
    if (this.mensagemTimer) {
      clearTimeout(this.mensagemTimer);
    }
  }

  realizarInscricao(): void {
    const participantesPreenchidos = this.participantes
      .filter((participante) => participante.nome.trim())
      .map((participante) => ({ nome: participante.nome.trim(), usuarioId: participante.usuarioId }));
    if (!this.evento || participantesPreenchidos.length === 0 || this.enviando) {
      this.erro = 'Informe pelo menos um participante.';
      return;
    }

    this.erro = '';
    this.mensagem = '';
    this.enviando = true;

    this.eventoApi.inscrever(this.evento.id, participantesPreenchidos).subscribe({
      next: ({ message, duplicadas }) => {
        this.mensagem = duplicadas > 0
          ? `${message}. ${duplicadas} nome(s) já estavam inscritos.`
          : message;
        this.limparFormulario();
        // Remove o retorno visual sem exigir uma nova acao do usuario.
        this.mensagemTimer = setTimeout(() => {
          this.mensagem = '';
        }, 5000);
        this.enviando = false;
      },
      error: (response: HttpErrorResponse) => {
        this.erro = response.error?.error || 'Não foi possível realizar a inscrição.';
        this.enviando = false;
      }
    });
  }

  adicionarParticipante(): void {
    if (this.participantes.length < 20) {
      this.participantes.push(this.criarParticipante());
    }
  }

  removerParticipante(index: number): void {
    if (this.participantes.length > 1) {
      this.participantes.splice(index, 1);
      const timer = this.buscaTimers.splice(index, 1)[0];
      if (timer) {
        clearTimeout(timer);
      }
    }
  }

  nomeAlterado(index: number): void {
    const participante = this.participantes[index];
    if (this.mensagemTimer) {
      clearTimeout(this.mensagemTimer);
      this.mensagemTimer = undefined;
    }
    this.mensagem = '';
    participante.usuarioId = null;
    participante.sugestoes = [];

    const timerAtual = this.buscaTimers[index];
    if (timerAtual) {
      clearTimeout(timerAtual);
    }

    if (participante.nome.trim().length < 3) {
      participante.pesquisando = false;
      return;
    }

    participante.pesquisando = true;
    this.buscaTimers[index] = setTimeout(() => {
      this.eventoApi.buscarUsuarios(participante.nome.trim()).subscribe({
        next: (usuarios) => {
          participante.sugestoes = usuarios;
          participante.pesquisando = false;
        },
        error: () => {
          participante.sugestoes = [];
          participante.pesquisando = false;
        }
      });
    }, 350);
  }

  selecionarUsuario(index: number, usuario: UsuarioResumo): void {
    const participante = this.participantes[index];
    participante.nome = usuario.nome;
    participante.usuarioId = usuario.id;
    participante.sugestoes = [];
    participante.pesquisando = false;
  }

  trackByIndex(index: number): number {
    // Mantem o mesmo input enquanto o texto muda para nao perder o foco.
    return index;
  }

  private criarParticipante(): ParticipanteForm {
    return { nome: '', usuarioId: null, sugestoes: [], pesquisando: false };
  }

  private limparFormulario(): void {
    this.buscaTimers.forEach((timer) => timer && clearTimeout(timer));
    this.buscaTimers.length = 0;
    this.participantes = [this.criarParticipante()];
  }
}
