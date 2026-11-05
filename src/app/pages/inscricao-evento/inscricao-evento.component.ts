import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventoApiService, EventoItem } from '../../services/evento-api.service';

@Component({
  selector: 'app-inscricao-evento',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inscricao-evento.component.html',
  styleUrls: ['./inscricao-evento.component.scss']
})
export class InscricaoEventoComponent implements OnInit {
  evento: EventoItem | null = null;
  celular = '';
  carregando = true;
  enviando = false;
  mensagem = '';
  erro = '';

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

  realizarInscricao(): void {
    if (!this.evento || !this.celular.trim() || this.enviando) {
      return;
    }

    this.erro = '';
    this.mensagem = '';
    this.enviando = true;

    this.eventoApi.inscrever(this.evento.id, this.celular).subscribe({
      next: ({ message }) => {
        this.mensagem = message;
        this.enviando = false;
      },
      error: (response: HttpErrorResponse) => {
        this.erro = response.error?.error || 'Não foi possível realizar a inscrição.';
        this.enviando = false;
      }
    });
  }
}
