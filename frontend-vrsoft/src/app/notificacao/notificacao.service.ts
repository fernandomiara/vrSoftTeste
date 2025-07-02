import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificacaoPayload {
  mensagemId: string;
  conteudoMensagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  enviarNotificacao(payload: NotificacaoPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/notificar`, payload, { observe: 'response' });
  }

  getStatus(mensagemId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/notificacao/status/${mensagemId}`);
  }
}