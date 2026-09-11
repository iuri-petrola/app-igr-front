import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

type LoginResponse = {
  token: string;
  expiresIn: string | number;
};

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly tokenKey = 'popv_admin_token';
  private readonly expiresAtKey = 'popv_admin_token_expires_at';
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/admin/login`, { username, password })
      .pipe(
        map((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          // Salva a expiração em milissegundos para validar a sessão sem depender da tela de login.
          localStorage.setItem(this.expiresAtKey, this.getExpirationTimestamp(response.expiresIn).toString());
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expiresAtKey);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    const expiresAt = Number(localStorage.getItem(this.expiresAtKey));

    // Limpa dados incompletos ou vencidos para nao tratar storage antigo como sessao valida.
    if (!token || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      this.logout();
      return null;
    }

    return token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getExpirationTimestamp(expiresIn: string | number): number {
    // Aceita segundos vindos do backend; se vier algo invalido, usa 1 hora como fallback seguro.
    const expiresInSeconds = Number(expiresIn);

    if (!Number.isFinite(expiresInSeconds) || expiresInSeconds <= 0) {
      return Date.now() + 60 * 60 * 1000;
    }

    return Date.now() + expiresInSeconds * 1000;
  }
}
