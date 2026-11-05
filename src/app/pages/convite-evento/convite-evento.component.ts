import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConvitePublico, EventoApiService } from '../../services/evento-api.service';

@Component({
  selector: 'app-convite-evento',
  imports: [CommonModule, RouterLink],
  templateUrl: './convite-evento.component.html',
  styleUrls: ['./convite-evento.component.scss']
})
export class ConviteEventoComponent implements OnInit {
  convite: ConvitePublico | null = null;
  carregando = true;
  confirmando = false;
  mensagem = '';
  erro = '';
  private eventoId = 0;
  private token = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventoApi: EventoApiService
  ) {}

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    this.token = this.route.snapshot.paramMap.get('token') || '';

    if (!Number.isInteger(this.eventoId) || this.eventoId <= 0 || !this.token) {
      this.erro = 'Convite inválido.';
      this.carregando = false;
      return;
    }

    this.eventoApi.getConvite(this.eventoId, this.token).subscribe({
      next: (convite) => {
        this.convite = convite;
        if (convite.jaInscrito) {
          this.mensagem = `${convite.usuarioNome}, sua inscrição já foi confirmada.`;
        }
        this.carregando = false;
      },
      error: (response: HttpErrorResponse) => {
        this.erro = response.error?.error || 'Não foi possível carregar este convite.';
        this.carregando = false;
      }
    });
  }

  confirmar(): void {
    if (!this.convite || this.convite.jaInscrito || this.confirmando) {
      return;
    }

    this.confirmando = true;
    this.erro = '';
    this.eventoApi.confirmarConvite(this.eventoId, this.token).subscribe({
      next: ({ message }) => {
        this.mensagem = message;
        this.convite = { ...this.convite!, jaInscrito: true };
        this.confirmando = false;
      },
      error: (response: HttpErrorResponse) => {
        this.erro = response.error?.error || 'Não foi possível confirmar sua inscrição.';
        this.confirmando = false;
      }
    });
  }
}
