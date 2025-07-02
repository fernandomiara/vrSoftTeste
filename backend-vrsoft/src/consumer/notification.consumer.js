const { getChannel } = require('../service/rabbitmq.service');
const statusService = require('../service/status.service');

exports.startConsumer = async () => {
  const ch = await getChannel();

  const filaEntrada = process.env.FILA_ENTRADA;
  const filaStatus = process.env.FILA_STATUS;

  await ch.assertQueue(filaEntrada, { durable: true });
  await ch.assertQueue(filaStatus, { durable: true });

  ch.consume(filaEntrada, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log('Recebido:', data);

      // Simula o processamento com delay entre 1s e 2s
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const sucesso = Math.floor(Math.random() * 10) + 1 > 2;
      const status = sucesso ? 'PROCESSADO_SUCESSO' : 'FALHA_PROCESSAMENTO';

      // Armazena status na memória
      statusService.setStatus(data.mensagemId, status);

      // Envia para fila de status
      const statusMsg = { mensagemId: data.mensagemId, status };
      ch.sendToQueue(filaStatus, Buffer.from(JSON.stringify(statusMsg)), { persistent: true });

      console.log('Processado e enviado status:', statusMsg);
      ch.ack(msg);
    }
  });
};