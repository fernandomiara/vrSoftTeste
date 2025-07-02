import { Component } from '@angular/core';
import { NotificacaoComponent } from './notificacao/notificacao';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificacaoComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}