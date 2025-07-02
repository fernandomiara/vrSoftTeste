import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificacaoService } from './notificacao.service';
import { v4 as uuidv4 } from 'uuid';

interface Notificacao {
  mensagemId: string;
  conteudoMensagem: string;
  status: string;
}

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificacao.html',
  styleUrls: ['./notificacao.scss']
})
export class NotificacaoComponent implements OnInit {
  conteudoMensagem = '';
  notificacoes: Notificacao[] = [];

  constructor(private notificacaoService: NotificacaoService) {}

  ngOnInit(): void {
    setInterval(() => this.verificarStatus(), 4000);
  }

  enviarNotificacao(): void {
    if (!this.conteudoMensagem.trim()) return;

    const mensagemId = uuidv4();

    this.notificacaoService.enviarNotificacao({
      mensagemId,
      conteudoMensagem: this.conteudoMensagem
    }).subscribe(response => {
      if (response.status === 202) {
        this.notificacoes.push({
          mensagemId,
          conteudoMensagem: this.conteudoMensagem,
          status: 'AGUARDANDO PROCESSAMENTO'
        });
        this.conteudoMensagem = '';
      }
    });
  }

  verificarStatus(): void {
    this.notificacoes.forEach(n => {
      if (n.status === 'AGUARDANDO PROCESSAMENTO') {
        this.notificacaoService.getStatus(n.mensagemId).subscribe(resp => {
          n.status = resp.status;
        });
      }
    });
  }
}