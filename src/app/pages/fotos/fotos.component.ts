import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MediaApiService, FotoItem, Ministerio } from '../../services/media-api.service';

@Component({
  selector: 'app-fotos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss']
})
export class FotosComponent implements OnInit {
  fotos: FotoItem[] = [];
  loading = true;
  errorMessage = '';
  ministerioNome = '';
  descricaoGaleria = '';

  constructor(
    private readonly mediaApiService: MediaApiService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const ministerio = this.route.snapshot.data['ministerio'] as Ministerio;
    this.ministerioNome = this.route.snapshot.data['ministerioNome'] as string;
    this.descricaoGaleria = ministerio === 'geral'
      ? 'Galeria de imagens'
      : `Galeria do ministério ${this.ministerioNome}.`;

    this.mediaApiService.getFotos(ministerio).subscribe({
      next: (data) => {
        this.fotos = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Nao foi possivel carregar as fotos.';
        this.loading = false;
      }
    });
  }
}
