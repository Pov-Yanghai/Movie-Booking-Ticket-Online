import Message from '../models/message.model.js';

const messages = [
  {
    name: 'Customer A',
    email: 'custA@example.com',
    subject: 'Support',
    message: 'Problem booking ticket'
  }
];

export const seedMessages = async () => {
  for (const msg of messages) {
    const exists = await Message.findOne({ where: { email: msg.email, subject: msg.subject } });
    if (!exists) {
      await Message.create(msg);
      console.log(`✅ Message from ${msg.email}`);
    } else {
      console.log(`⚠️ Message already exists from ${msg.email}`);
    }
  }
};
