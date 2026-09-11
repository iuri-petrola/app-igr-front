import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FotoItem, MediaApiService } from '../../services/media-api.service';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-midias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-midias.component.html',
  styleUrls: ['./admin-midias.component.scss']
})
export class AdminMidiasComponent implements OnInit {
  @ViewChild('fotoFormElement') fotoFormElement?: ElementRef<HTMLElement>;

  fotos: FotoItem[] = [];

  fotoForm = { titulo: '', instagramUrl: '' };
  fotoFile: File | null = null;

  editingFotoId: number | null = null;

  feedback = '';

  constructor(
    private readonly mediaApiService: MediaApiService,
    private readonly authService: AdminAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadFotos();
  }

  loadFotos(): void {
    this.mediaApiService.getFotos().subscribe({ next: (data) => (this.fotos = data) });
  }

  onFotoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fotoFile = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  saveFoto(): void {
    if (!this.fotoForm.titulo.trim()) {
      this.feedback = 'Preencha o nome.';
      return;
    }

    if (this.editingFotoId) {
      this.mediaApiService.updateFoto(this.editingFotoId, {
        titulo: this.fotoForm.titulo.trim(),
        instagramUrl: this.fotoForm.instagramUrl.trim(),
        image: this.fotoFile
      }).subscribe({
        next: () => {
          this.feedback = 'Foto atualizada com sucesso.';
          this.cancelFotoEdit();
          this.loadFotos();
        },
        error: () => (this.feedback = 'Erro ao atualizar foto.')
      });
      return;
    }

    if (!this.fotoFile) {
      this.feedback = 'Selecione uma imagem para criar a foto.';
      return;
    }

    this.mediaApiService.createFoto({
      titulo: this.fotoForm.titulo.trim(),
      instagramUrl: this.fotoForm.instagramUrl.trim(),
      image: this.fotoFile
    }).subscribe({
      next: () => {
        this.feedback = 'Foto criada com sucesso.';
        this.fotoForm = { titulo: '', instagramUrl: '' };
        this.fotoFile = null;
        this.loadFotos();
      },
      error: () => (this.feedback = 'Erro ao criar foto.')
    });
  }

  editFoto(item: FotoItem): void {
    this.editingFotoId = item.id;
    this.fotoForm = {
      titulo: item.titulo,
      instagramUrl: item.instagramUrl || ''
    };
    this.fotoFile = null;
    this.scrollToFotoForm();
  }

  cancelFotoEdit(): void {
    this.editingFotoId = null;
    this.fotoForm = { titulo: '', instagramUrl: '' };
    this.fotoFile = null;
  }

  removeFoto(id: number): void {
    if (!confirm('Remover esta foto?')) {
      return;
    }

    this.mediaApiService.deleteFoto(id).subscribe({
      next: () => {
        this.feedback = 'Foto removida.';
        this.loadFotos();
      },
      error: () => (this.feedback = 'Erro ao remover foto.')
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  private scrollToFotoForm(): void {
    // Aguarda o Angular refletir o modo de edicao antes de calcular a rolagem.
    setTimeout(() => {
      const formElement = this.fotoFormElement?.nativeElement;
      if (!formElement) {
        return;
      }

      const headerHeight = document.querySelector('.site-header')?.clientHeight ?? 0;
      const viewportHeight = window.innerHeight;
      const margem = 16;
      const rect = formElement.getBoundingClientRect();
      const availableHeight = viewportHeight - headerHeight - margem * 2;

      let targetTop = window.scrollY + rect.top - headerHeight - margem;

      if (rect.height < availableHeight) {
        const extraSpace = availableHeight - rect.height;
        targetTop -= extraSpace / 2;
      }

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
    });
  }
}
