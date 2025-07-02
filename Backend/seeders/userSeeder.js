import User from '../models/users.model.js';

const users = [
  { email: 'admin@example.com', password: '123456', image: 'admin.jpg' },
  { email: 'user@example.com', password: 'abcdef', image: 'user.jpg' }
];

export const seedUsers = async () => {
  for (const user of users) {
    const exists = await User.findOne({ where: { email: user.email } });
    if (!exists) {
      await User.create(user);
      console.log(`✅ User added: ${user.email}`);
    } else {
      console.log(`⚠️ User already exists: ${user.email}`);
    }
  }
};
