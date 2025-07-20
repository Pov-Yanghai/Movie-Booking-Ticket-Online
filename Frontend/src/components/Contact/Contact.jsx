import React, { useState } from 'react';
import './Contact.css'; // Importing the CSS file for styling
import { PhoneIcon, EnvelopeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'; // Importing Heroicons

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    //  connect from frontend to backend
    try {
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })

      });
    alert('Message sent successfully!');
    setName(''); // Clear the name field
    setEmail(''); // Clear the email field 
    setMessage('');// Clear the message field
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    }
};

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <div className="contact-info">
        <div className="hotline">
          <h2>Hotline</h2>
          <p><PhoneIcon className="icon" />096 781 7889</p>
          <p><EnvelopeIcon className="icon" /> info@moviebook.com.kh</p>
          <p><ChatBubbleLeftIcon className="icon" /> Messenger</p>
        </div>

        <div className="advertising">
          <h2>Advertising & Partnership</h2>
          <p><PhoneIcon className="icon" /> 087 888 045 / 087 888 048</p>
          <p><EnvelopeIcon className="icon" /> marketing@MoviesBook.kh</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;