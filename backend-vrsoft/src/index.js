const app = require('./app');
const { startConsumer } = require('./consumer/notification.consumer');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  startConsumer();
});