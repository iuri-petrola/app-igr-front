import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type FotoItem = {
  id: number;
  titulo: string;
  dataUpload: string;
  imagemUrl: string;
  instagramUrl: string | null;
  ministerio: Ministerio;
};

export type Ministerio = 'geral' | 'posso-orar-por-voce' | 'koynonia';

export type PalavraDoDiaItem = {
  texto: string;
  livro: string;
  capitulo: number;
  versiculo: number;
  referencia: string;
  traducao: string;
  fonte: string;
};

export type PedidoResponse = {
  id: number;
  nome: string;
  contato: string | null;
  pedido: string;
  enviadoPara: string | null;
  createdAt: string;
  whatsAppUrl: string | null;
};

export type PedidoAdminItem = {
  id: number;
  nome: string;
  contato: string | null;
  pedido: string;
  enviadoPara: string | null;
  createdAt: string;
};

export type ContatoResponse = {
  whatsAppUrl: string;
};

@Injectable({ providedIn: 'root' })
export class MediaApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getFotos(ministerio?: Ministerio): Observable<FotoItem[]> {
    const url = ministerio
      ? `${this.baseUrl}/fotos?ministerio=${encodeURIComponent(ministerio)}`
      : `${this.baseUrl}/fotos`;
    return this.http.get<FotoItem[]>(url);
  }


  createFoto(payload: { titulo: string; instagramUrl: string; ministerio: Ministerio; image: File }): Observable<FotoItem> {
    const formData = new FormData();
    formData.append('titulo', payload.titulo);
    formData.append('instagramUrl', payload.instagramUrl);
    formData.append('ministerio', payload.ministerio);
    formData.append('image', payload.image);
    return this.http.post<FotoItem>(`${this.baseUrl}/fotos`, formData);
  }

  updateFoto(
    id: number,
    payload: { titulo: string; instagramUrl: string; ministerio: Ministerio; image?: File | null }
  ): Observable<FotoItem> {
    const formData = new FormData();
    formData.append('titulo', payload.titulo);
    formData.append('instagramUrl', payload.instagramUrl);
    formData.append('ministerio', payload.ministerio);
    if (payload.image) {
      formData.append('image', payload.image);
    }
    return this.http.put<FotoItem>(`${this.baseUrl}/fotos/${id}`, formData);
  }

  deleteFoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/fotos/${id}`);
  }




  getPalavraDoDia(): Observable<PalavraDoDiaItem> {
    return this.http.get<PalavraDoDiaItem>(`${this.baseUrl}/palavra-do-dia`);
  }

  createPedido(payload: {
    nome: string;
    contato?: string;
    pedido: string;
  }): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.baseUrl}/pedidos`, payload);
  }

  getPedidos(): Observable<PedidoAdminItem[]> {
    return this.http.get<PedidoAdminItem[]>(`${this.baseUrl}/admin/pedidos`);
  }

  getContato(): Observable<ContatoResponse> {
    return this.http.get<ContatoResponse>(`${this.baseUrl}/contato`);
  }
}
