// frontend/src/components/Home.js (Updated Upload View)

// frontend/src/components/Home.js

import React, { useState } from 'react';
import axios from 'axios';
import Result from './Result';
import styles from './Home.module.css'; // New CSS Module import
import { FaUpload } from 'react-icons/fa'; // Ensure you installed react-icons

export default function Home({ user }){
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null); 
  };

  const upload = async (e) => {
    e.preventDefault();
    if(!file) return alert('Please select an image file.');
    if(!token) return alert('Please log in first.');

    setLoading(true);
    const form = new FormData();
    form.append('image', file);

    try{
      const res = await axios.post('http://localhost:3001/api/skin/predict', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data.result);
    }catch(e){
      alert(`Upload failed: ${e.response?.data?.error || e.message}`);
    }finally{
      setLoading(false);
    }
  };

  const handleNewUpload = () => {
    setResult(null); 
    setFile(null); 
    setPreview(null);
  }

  return (
    <div className={styles.homeContainer}>
      
      <h2 className={styles.mainTitle}>
        {result ? "Scan another photo?" : "Add a photo to scan"}
      </h2>
      
      {!user && <p className={styles.loginWarning}>
          Please log in to upload images and save prediction history.
      </p>}
      
      <div className={styles.contentWrapper}>
        
        {/* State 1: Before Prediction, showing upload box or preview */}
        {!result && (
          <form onSubmit={upload} className={styles.uploadForm}>
              <label className={styles.uploadBox}>
                  <FaUpload className={styles.uploadIcon} />
                  Upload photo
                  <input type="file" accept="image/*" onChange={handleFile} required className={styles.fileInput} />
              </label>
              
              {preview && (
                  <div className={styles.previewContainer}>
                      <img src={preview} alt="preview" className={styles.previewImage} />
                      <button type="submit" disabled={loading || !user} className={styles.predictButton}> 
                          {loading ? 'Processing Model...' : 'Upload & Predict'} 
                      </button>
                  </div>
              )}
          </form>
        )}
      </div>

      {/* State 2: Showing Result */}
      {result && <Result result={result} onNew={handleNewUpload} />}
    </div>
  );
}