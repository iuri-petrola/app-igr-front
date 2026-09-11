import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaApiService, FotoItem } from '../../services/media-api.service';

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

  constructor(private readonly mediaApiService: MediaApiService) {}

  ngOnInit(): void {
    this.mediaApiService.getFotos().subscribe({
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
