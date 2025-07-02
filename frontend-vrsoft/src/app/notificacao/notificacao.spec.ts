import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacaoComponent } from './notificacao';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import * as uuid from 'uuid';

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let httpMock: HttpTestingController;

  const mockUUID = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificacaoComponent],
      imports: [HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Mock UUID para retornar um valor fixo
    spyOn(uuid, 'v4').and.returnValue(mockUUID);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve gerar mensagemId, enviar POST e adicionar notificação com status inicial', () => {
    component.conteudoMensagem = 'Mensagem de teste';

    component.enviarNotificacao();

    const req = httpMock.expectOne('/api/notificar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      mensagemId: mockUUID,
      conteudoMensagem: 'Mensagem de teste'
    });

    // Simula resposta do backend
    req.flush({ mensagem: 'Mensagem recebida.', mensagemId: mockUUID });

    expect(component.notificacoes.length).toBe(1);
    expect(component.notificacoes[0]).toEqual({
      mensagemId: mockUUID,
      conteudoMensagem: 'Mensagem de teste',
      status: 'AGUARDANDO PROCESSAMENTO'
    });

    // Verifica que o campo foi limpo após o envio
    expect(component.conteudoMensagem).toBe('');
  });
});