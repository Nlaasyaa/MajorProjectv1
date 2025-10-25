import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Uses the shared CSS Module

export default function SignupForm({ onLogin }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  // The submit function is CORRECTLY DEFINED here as a local constant.
  const submit = async (e) => {
    e.preventDefault();
    setErr(null); // Clear previous errors
    try{
      const res = await axios.post('http://localhost:3001/api/auth/register', { name, email, password });
      
      // Store token and update user state in App.js
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);
      navigate('/');
    }catch(e){
      setErr(e.response?.data?.error || 'Registration failed');
    }
  };

  return (
    // Outer wrapper for the full page layout
    <div className={styles.pageWrapper}>
      <div className={styles.authCard}>
        
        {/* Left Panel: Illustration Area (Styled via CSS Module) */}
        <div className={styles.illustrationPanel}>
            {/* Placeholder for your actual image/SVG */}
            <img 
                src="https://via.placeholder.com/400x300.png?text=Create+Account" 
                alt="Signup Illustration" 
                className={styles.illustrationImage}
            />
        </div>
        
        {/* Right Panel: Form */}
        <div className={styles.formPanel}>
          <h2 className={styles.formTitle}>Sign up</h2>
          
          {/* onSubmit={submit} now correctly references the local function */}
          <form onSubmit={submit} className={styles.formGroup}>
            <label className={styles.label}>Full name *</label>
            <input 
              placeholder="Full name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className={styles.inputField} 
            />
            
            <label className={styles.label}>Email *</label>
            <input 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email" 
              required 
              className={styles.inputField} 
            />
            
            <label className={styles.label}>Password *</label>
            <input 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              type="password" 
              required 
              className={styles.inputField} 
            />
            
            <button type="submit" className={styles.loginButton}>Register</button>
          </form>
          
          <div className={styles.signupLink}>
             Already have an account? <Link to="/login">Log in</Link>
          </div>
          {err && <p className={styles.errorText}>{err}</p>}
        </div>
      </div>
    </div>
  );
}