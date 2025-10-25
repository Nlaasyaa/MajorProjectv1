// frontend/src/components/History.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './History.module.css';
import { FaHeartbeat } from 'react-icons/fa';


export default function History({ user }){
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(()=>{
    if(!token) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    axios.get('http://localhost:3001/api/skin/history', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setHistory(res.data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error("History fetch error:", err);
        setLoading(false);
      });
  },[token]);

  if(!token) return <p className={styles.warning}>Please login to see your history.</p>;
  if(loading) return <p className={styles.loading}>Loading history...</p>;

  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.historyTitle}>Your Upload History</h2>
      
      {history.length === 0 && <p className={styles.noHistory}>No prediction history found.</p>}
      
      <div className={styles.grid}>
        {history.map(item => (
          <div key={item._id} className={styles.historyCard}>
            <h4 className={styles.cardTitle}>Uploaded image</h4>
            <img 
              src={`http://localhost:3001${item.imageUrl}`} 
              alt={item.label} 
              className={styles.historyImage}
            />
            
            <h4 className={styles.cardTitle}>Predictions</h4>
            
            <div className={styles.details}>
                <FaHeartbeat className={styles.icon} />
                <div>
                    <p className={styles.label}>Skin type: <span className={styles.value}>{item.label}</span></p>
                    <p className={styles.probability}>Probability: {(item.probability * 100).toFixed(2)}%</p>
                    <p className={styles.date}>{new Date(item.createdAt).toLocaleString()}</p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}