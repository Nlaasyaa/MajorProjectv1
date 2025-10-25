import React from 'react';
import styles from './Home.module.css'; // Using the same module for layout
// FIX: Add FaUpload to the import list
import { FaHeartbeat, FaPercent, FaInfoCircle, FaSyringe, FaClock, FaUpload } from 'react-icons/fa';

export default function Result({ result, onNew }){
  if(!result) return null;
  
  return (
    <div className={styles.resultContainer}>
        
      {/* Left Column: Image and Scan New Button */}
      <div className={styles.imageCard}>
        <h4 className={styles.cardTitle}>Uploaded image</h4>
        <img 
          src={`http://localhost:3001${result.imageUrl}`} 
          alt="uploaded skin lesion" 
          className={styles.resultImage}
        />
        <button onClick={onNew} className={styles.newScanButton}>
          {/* FaUpload is now defined */}
          <FaUpload className={styles.newScanIcon} />
          Scan another photo?
        </button>
      </div>
      
      {/* Right Column: Predictions Details (Rest of your code remains the same) */}
      <div className={styles.predictionCard}>
        <h4 className={styles.cardTitle}>Predictions</h4>
        
        <div className={styles.predictionList}>
            {/* Skin Type */}
            <div className={styles.predictionItem}>
                <FaHeartbeat className={styles.iconRed} />
                <div>
                    <span className={styles.itemLabel}>Skin type</span>
                    <p className={styles.itemValue}>{result.label}</p>
                </div>
            </div>
            
            {/* Probability */}
            <div className={styles.predictionItem}>
                <FaPercent className={styles.iconGray} />
                <div>
                    <span className={styles.itemLabel}>Probability</span>
                    <p className={styles.itemValue}>{(result.probability * 100).toFixed(2)}%</p>
                </div>
            </div>
            
            {/* Symptoms */}
            <div className={styles.predictionItem}>
                <FaInfoCircle className={styles.iconOrange} />
                <div>
                    <span className={styles.itemLabel}>Symptoms</span>
                    <p className={styles.itemDetail}>{result.symptoms}</p>
                </div>
            </div>
            
            {/* Treatments */}
            <div className={styles.predictionItem}>
                <FaSyringe className={styles.iconBlue} />
                <div>
                    <span className={styles.itemLabel}>Treatments</span>
                    <p className={styles.itemDetail}>{result.treatments}</p>
                </div>
            </div>

            {/* Duration */}
            <div className={styles.predictionItem}>
                <FaClock className={styles.iconPurple} />
                <div>
                    <span className={styles.itemLabel}>Duration</span>
                    <p className={styles.itemDetail}>{result.duration}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}