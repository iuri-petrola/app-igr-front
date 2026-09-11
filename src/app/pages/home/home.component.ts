import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MediaApiService, PalavraDoDiaItem } from '../../services/media-api.service';

type DailyVerse = {
  texto: string;
  livro: string;
  capitulo: number;
  versiculo: number;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  palavraDoDia: DailyVerse | null = null;
  origem = '';

  constructor(private readonly mediaApiService: MediaApiService) {}

  ngOnInit(): void {
    this.mediaApiService.getPalavraDoDia().subscribe({
      next: (item: PalavraDoDiaItem) => {
        this.palavraDoDia = {
          texto: item.texto,
          livro: item.livro,
          capitulo: item.capitulo,
          versiculo: item.versiculo
        };
        this.origem = item.fonte;
      },
      error: () => {
        this.palavraDoDia = {
          texto: 'Entregue o seu caminho ao Senhor; confie nele, e ele agira.',
          livro: 'Salmos',
          capitulo: 37,
          versiculo: 5
        };
        this.origem = 'local';
      }
    });
  }
}
