import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaApiService } from '../../services/media-api.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent implements OnInit {
  whatsAppUrl = '';
  carregandoContato = true;
  erroContato = '';

  constructor(private readonly mediaApiService: MediaApiService) {}

  ngOnInit(): void {
    this.carregarContato();
  }

  private carregarContato(): void {
    // O número vem do config.json por meio da API, sem expor o arquivo ao navegador.
    this.mediaApiService.getContato().subscribe({
      next: ({ whatsAppUrl }) => {
        this.whatsAppUrl = whatsAppUrl;
        this.carregandoContato = false;
      },
      error: () => {
        this.erroContato = 'Não foi possível carregar o WhatsApp.';
        this.carregandoContato = false;
      }
    });
  }
}
