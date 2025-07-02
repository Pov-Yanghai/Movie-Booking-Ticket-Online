import React from 'react';
import './Footer.css'; // Import the CSS file
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaTelegram } from 'react-icons/fa';
import { AiFillApple, AiFillAndroid } from 'react-icons/ai'; 
import { SiVisa, SiMastercard } from 'react-icons/si'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section company">
        <h3>Company</h3>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Cinemas</a></li>
        </ul>
      </div>

      <div className="footer-section more">
        <h3>More</h3>
        <ul>
          <li><a href="#">Promotions</a></li>
          <li><a href="#">News & Activity</a></li>
          <li><a href="#">My Ticket</a></li>
          <li><a href="#">Terms & Conditions</a></li>
          <li><a href="#">Privacy & Policy</a></li>
        </ul>
      </div>

      <div className="footer-section download">
        <h3>Download Our App</h3>
        <div className="app-icons">
          <a href="#"><AiFillApple size={40} color="#FFF" /></a> 
          <a href="#"><AiFillAndroid size={40} color="#3ddc84" /></a> 
        </div>
      </div>

      <div className="footer-section social">
        <h3>Follow Our Social Media</h3>
        <div className="social-icons">
          <a href="#"><FaFacebook size={30} color="#3b5998" /></a> 
          <a href="#"><FaInstagram size={30} color="#e1306c" /></a>
          <a href="#"><FaYoutube size={30} color="#ff0000" /></a> 
          <a href="#"><FaTiktok size={30} color="#000" /></a> 
          <a href="#"><FaTelegram size={30} color="#0088cc" /></a> 
        </div>
      </div>

      <div className="footer-section payment">
        <h3>Payment</h3>
        <div className="payment-icons">
          <a href="#"><SiVisa size={40} color="#001f99" /></a> 
          <a href="#"><SiMastercard size={40} color="#eb001b" /></a> 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
