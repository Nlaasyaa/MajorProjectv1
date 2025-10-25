import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';

export default function NavBar({ user, onLogout }){
  return (
    <div className={styles.navbar}>
      <div>
        <Link to="/" className={styles.brand}>SkinSight</Link>
      </div>
      <div className={styles.links}>
        {user && <span className={styles.userName}>{user.name}</span>}
        {user && <Link to="/history" className={styles.link}>HISTORY</Link>}
        {user && <button onClick={onLogout} className={styles.logoutButton}>LOG OUT</button>}
        {!user && <Link to="/signup" className={styles.link}>SIGN UP</Link>}
        {!user && <Link to="/login" className={styles.link}>LOG IN</Link>}
      </div>
    </div>
  );
}