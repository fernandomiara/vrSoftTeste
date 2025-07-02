const amqp = require('amqplib');
let channel;

const connect = async () => {
  if (!channel) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
  }
  return channel;
};

exports.publishToQueue = async (queue, payload) => {
  const ch = await connect();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), { persistent: true });
};

exports.getChannel = connect;