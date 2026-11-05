import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type EventoItem = {
  id: number;
  titulo: string;
  descricao: string | null;
  local: string | null;
  dataEvento: string;
  prazoInscricao: string | null;
  inscricoesAbertas: boolean;
  _count?: { inscricoes: number };
};

export type UsuarioItem = {
  id: number;
  nome: string;
  celular: string;
  email: string | null;
};

export type ConviteGerado = {
  conviteUrl: string;
  expiresAt: string;
  evento: { id: number; titulo: string };
  usuario: { id: number; nome: string; celular: string };
};

export type ConvitePublico = {
  evento: EventoItem;
  usuarioNome: string;
  jaInscrito: boolean;
};

@Injectable({ providedIn: 'root' })
export class EventoApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getEventos(): Observable<EventoItem[]> {
    return this.http.get<EventoItem[]>(`${this.baseUrl}/eventos`);
  }

  getEvento(id: number): Observable<EventoItem> {
    return this.http.get<EventoItem>(`${this.baseUrl}/eventos/${id}`);
  }

  inscrever(id: number, celular: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/eventos/${id}/inscricoes`, { celular });
  }

  getEventosAdmin(): Observable<EventoItem[]> {
    return this.http.get<EventoItem[]>(`${this.baseUrl}/admin/eventos`);
  }

  createEvento(payload: {
    titulo: string;
    descricao: string;
    local: string;
    dataEvento: string;
    prazoInscricao: string | null;
  }): Observable<EventoItem> {
    return this.http.post<EventoItem>(`${this.baseUrl}/admin/eventos`, payload);
  }

  getUsuariosAdmin(): Observable<UsuarioItem[]> {
    return this.http.get<UsuarioItem[]>(`${this.baseUrl}/admin/usuarios`);
  }

  createUsuario(payload: { nome: string; celular: string; email: string }): Observable<UsuarioItem> {
    return this.http.post<UsuarioItem>(`${this.baseUrl}/admin/usuarios`, payload);
  }

  createConvite(eventoId: number, usuarioId: number): Observable<ConviteGerado> {
    return this.http.post<ConviteGerado>(`${this.baseUrl}/admin/eventos/${eventoId}/convites`, { usuarioId });
  }

  getConvite(eventoId: number, token: string): Observable<ConvitePublico> {
    return this.http.get<ConvitePublico>(`${this.baseUrl}/eventos/${eventoId}/convites/${token}`);
  }

  confirmarConvite(eventoId: number, token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/eventos/${eventoId}/convites/${token}/confirmar`,
      {}
    );
  }
}
