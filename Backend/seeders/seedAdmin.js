import bcrypt from 'bcrypt';
import User from '../models/users.model.js';
import sequelize from '../utils/db.js';

const seedAdmin = async () => {
  try {
    await sequelize.sync();   

    const existingAdmin = await User.findOne({ where: { email: 'admin@gamail.com' } });  // check if admin already exists
    if (existingAdmin) {  // check if admin already exists 
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10); // admin ppassword : admin123 with gmail admin: admin@gmail.com

    await User.create({
      email: 'admin@gmail.com', // admin email
      password: hashedPassword,  // hashed password for security
      role: 'admin',   // create role for admin only 
      image: null,  // no image for admin
    });

    console.log('Admin user created with email: admin@gmail.com and password: admin123');
  } catch (error) {
    console.error('Failed to seed admin:', error);
  } finally {
    await sequelize.close();
  }
};

seedAdmin();
// seed role admin to manage the application