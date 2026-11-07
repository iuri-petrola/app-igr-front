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
  inscricoes?: Array<{ nome: string }>;
  linkInscricao?: string;
};

export type UsuarioItem = {
  id: number;
  nome: string;
  celular: string;
  email: string | null;
};

export type UsuarioResumo = Pick<UsuarioItem, 'id' | 'nome'>;

export type InscricaoEventoItem = {
  id: number;
  nome: string;
  createdAt: string;
  usuario: UsuarioItem | null;
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

  inscrever(
    id: number,
    participantes: Array<{ nome: string; usuarioId: number | null }>
  ): Observable<{ message: string; quantidade: number; duplicadas: number }> {
    return this.http.post<{ message: string; quantidade: number; duplicadas: number }>(
      `${this.baseUrl}/eventos/${id}/inscricoes`,
      { participantes }
    );
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

  buscarUsuarios(nome: string): Observable<UsuarioResumo[]> {
    return this.http.get<UsuarioResumo[]>(`${this.baseUrl}/usuarios/busca?nome=${encodeURIComponent(nome)}`);
  }

  getInscricoesEvento(eventoId: number): Observable<InscricaoEventoItem[]> {
    return this.http.get<InscricaoEventoItem[]>(`${this.baseUrl}/admin/eventos/${eventoId}/inscricoes`);
  }

}
