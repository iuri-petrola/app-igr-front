import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaApiService } from '../../services/media-api.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent {
  form = {
    nome: '',
    contato: '',
    pedido: ''
  };

  loading = false;
  feedback = '';
  private feedbackTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly mediaApiService: MediaApiService) {}

  submit(): void {
    this.clearFeedbackTimeout();

    if (!this.form.nome.trim() || !this.form.pedido.trim()) {
      this.feedback = 'Preencha nome e pedido.';
      return;
    }

    this.loading = true;
    this.feedback = '';

    this.mediaApiService
      .createPedido({
        nome: this.form.nome.trim(),
        contato: this.form.contato.trim(),
        pedido: this.form.pedido.trim()
      })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.feedback = response.whatsAppUrl
            ? 'Pedido salvo. Abrindo WhatsApp...'
            : 'Pedido salvo, mas o WhatsApp nao esta configurado no servidor.';

          this.form = { nome: '', contato: '', pedido: '' };

          if (response.whatsAppUrl) {
            window.open(response.whatsAppUrl, '_blank', 'noopener,noreferrer');
            this.feedbackTimeoutId = setTimeout(() => {
              this.feedback = '';
              this.feedbackTimeoutId = null;
            }, 5000);
          }
        },
        error: (error) => {
          this.loading = false;
          this.feedback = error?.error?.error || 'Nao foi possivel enviar o pedido.';
        }
      });
  }

  private clearFeedbackTimeout(): void {
    if (this.feedbackTimeoutId) {
      clearTimeout(this.feedbackTimeoutId);
      this.feedbackTimeoutId = null;
    }
  }
}
