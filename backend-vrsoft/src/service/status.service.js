const statusMap = new Map();

let io = null;

exports.setSocketIO = (socketServer) => {
  io = socketServer;
};

exports.setStatus = (id, status) => {
  statusMap.set(id, status);

  if (io) {
    io.emit('statusAtualizado', { mensagemId: id, status });
  }
};

exports.getStatus = (id) => {
  return statusMap.get(id);
};