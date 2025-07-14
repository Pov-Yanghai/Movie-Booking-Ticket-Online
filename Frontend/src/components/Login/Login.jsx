import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import * as jwt_decode from 'jwt-decode';
import { jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode JWT tokens
 // decode token and check role
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful');

        // Save token to localStorage so it can be used in protected routes
        localStorage.setItem('token', data.token);

        // added new for admin login 
        const decoded = jwtDecode(data.token);
        const userRole = decoded.role; // decode token to get user role
        if (userRole === 'admin') {
          navigate('/admin'); // redirect to admin dashboard if user is admin
        } else {

         navigate('/movies'); // redirect to movies page for regular users
        } 
      } else {
        alert(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };

  return (
    <section className="login-section">
      <h2>Login Here</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email Here"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Enter Password Here"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up here</a></p>
    </section>
  );
};

export default Login;
