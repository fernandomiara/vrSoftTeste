const { v4: uuidv4 } = require('uuid');
const { publishToQueue } = require('../service/rabbitmq.service');
const statusService = require('../service/status.service');

exports.notificar = async (req, res) => {
  const { conteudoMensagem } = req.body;

  //valida conteudo vazio
  if (!conteudoMensagem || conteudoMensagem.trim() === '') {
    return res.status(400).json({ erro: 'conteudoMensagem não pode ser vazio.' });
  }

  const mensagemId = uuidv4();
  const payload = { mensagemId, conteudoMensagem };

  try {
    await publishToQueue(process.env.FILA_ENTRADA, payload);
    statusService.setStatus(mensagemId, 'AGUARDANDO PROCESSAMENTO');
    return res.status(202).json({ mensagem: 'Mensagem recebida.', mensagemId });
  } catch (err) {
    console.error('Erro ao publicar mensagem:', err);
    return res.status(500).json({ erro: 'Erro interno ao publicar mensagem.' });
  }
};


exports.getStatus = (req, res) => {
  const status = statusService.getStatus(req.params.id);
  if (!status) {
    return res.status(404).json({ status: 'NÃO_ENCONTRADO' });
  }
  res.json({ status });
};