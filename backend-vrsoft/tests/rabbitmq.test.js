jest.mock('amqplib');

const amqplib = require('amqplib');
const { publishToQueue } = require('../src/service/rabbitmq.service');
const testePublicarNaFila = 'Com amqplib deu certo, deve publicar corretamente na fila';
const filaTeste = 'fila.teste';

describe('RabbitMQ - publishToQueue', () => {
  let mockChannel;

  beforeEach(() => {
    mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn()
    };

    const mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel)
    };

    amqplib.connect.mockResolvedValue(mockConnection);
  });

  it(testePublicarNaFila, async () => {
    const payload = { mensagemId: '123', conteudoMensagem: 'teste' };

    await publishToQueue(filaTeste, payload);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith(filaTeste, { durable: true });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      filaTeste,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );
  });
});