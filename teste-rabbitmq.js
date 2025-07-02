const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://vrsoftware:6uOVxR6dy1H7Zqfz@137.131.204.96:5672';
const FILA = 'fila.notificacao.entrada.fernandomiara';

(async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(FILA, { durable: true });

    const msg = {
      mensagemId: 'teste-de-carga',
      conteudoMensagem: 'Mensagem de teste do Fernando'
    };

    channel.sendToQueue(FILA, Buffer.from(JSON.stringify(msg)), { persistent: true });
    console.log(`Mensagem publicada com sucesso na fila ${FILA}`);

    await channel.close();
    await connection.close();
  } catch (err) {
    console.error('Erro ao conectar/publicar no RabbitMQ:', err);
  }
})();