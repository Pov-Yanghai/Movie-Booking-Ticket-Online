import Message from '../models/message.model.js';

export const createMessage = async (req, res) => {
    try {
        const {name, email, message} = req.body;
        const savedMessage = await Message.create({ name, email, message });
        res.status(201).json({ message: 'Message sent successfully', data: savedMessage });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }

};

// for admin to get all messages  to dashboard
export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({ order: [['createdAt', 'DESC']] });
        return res.status(200).json(messages);
    }catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
};