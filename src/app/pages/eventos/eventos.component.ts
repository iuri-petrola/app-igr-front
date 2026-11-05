import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventoApiService, EventoItem } from '../../services/evento-api.service';

@Component({
  selector: 'app-eventos',
  imports: [CommonModule, RouterLink],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  eventos: EventoItem[] = [];
  carregando = true;
  erro = '';

  constructor(private readonly eventoApi: EventoApiService) {}

  ngOnInit(): void {
    this.eventoApi.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os eventos.';
        this.carregando = false;
      }
    });
  }
}
