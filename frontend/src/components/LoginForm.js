import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Shared styles for Login/Signup

export default function LoginForm({ onLogin }){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    // ... (Login logic remains the same)
    try{
      const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);
      navigate('/');
    }catch(e){
      setErr(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authCard}>
        {/* Left Panel: Illustration (Screenshot 1) */}
        <div className={styles.illustrationPanel}>
          {/* Placeholder for your actual image/SVG */}
          <img 
            src="https://via.placeholder.com/400x300.png?text=Skin+Analysis" 
            alt="Skin Analysis" 
            className={styles.illustrationImage}
          />
        </div>

        {/* Right Panel: Form */}
        <div className={styles.formPanel}>
          <h2 className={styles.formTitle}>Log In</h2>
          <form onSubmit={submit} className={styles.formGroup}>
            <label className={styles.label}>Username *</label>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required className={styles.inputField} />
            <label className={styles.label}>Password *</label>
            <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required className={styles.inputField} />
            
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="showPassword" />
              <label htmlFor="showPassword">Show password</label>
            </div>

            <button type="submit" className={styles.loginButton}>LOG IN</button>
          </form>
          <div className={styles.signupLink}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
          {err && <p className={styles.errorText}>{err}</p>}
        </div>
      </div>
    </div>
  );
}