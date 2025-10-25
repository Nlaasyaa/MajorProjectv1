# predict.py
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import io
import os
import tensorflow as tf

app = Flask(__name__)

# --- CONFIG ---
# Assuming 'predict.py' is inside 'MajorProject/ai_service' 
# and the model is at 'MajorProject/ai_service/model/densenet_skin_lesion_model.h5'
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'densenet_skin_lesion_model.h5')

# Define class labels in the same order used during training
CLASSES = ['AKIEC', 'BCC', 'BKL', 'DF', 'MEL', 'NV', 'VASC'] 

# Update to the size your model expects (DenseNet typically uses 224x224)
IMG_SIZE = (224, 224) 
# ----------------

# CRITICAL FIX for 'TypeError: string indices must be integers, not 'str'':
# Load the model with compile=False to bypass loading the optimizer/loss config, 
# as it's only needed for inference, not training.
try:
    print(f"Attempting to load model from: {MODEL_PATH}")
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("Model loaded successfully.")
except Exception as e:
    print(f"FATAL ERROR: Could not load model. Check path and version compatibility.")
    print(f"Error details: {e}")
    # In a real service, you might exit or return a health error.
    model = None # Set to None if loading fails

def preprocess_image(image_bytes):
    """
    Decodes image bytes, resizes, normalizes, and prepares for model input.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize(IMG_SIZE)
    # Convert to numpy array and normalize to [0, 1]
    arr = np.array(img, dtype=np.float32) / 255.0
    # Add batch dimension: (H, W, C) -> (1, H, W, C)
    arr = np.expand_dims(arr, axis=0)
    return arr

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'AI service is offline: Model failed to load at startup.'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided in the request.'}), 400
        
    file = request.files['image']
    
    try:
        image_bytes = file.read()
        x = preprocess_image(image_bytes)
        
        # Perform prediction
        preds = model.predict(x, verbose=0)[0]  # vector of probabilities
        
        top_idx = int(np.argmax(preds))
        label = CLASSES[top_idx]
        probability = float(preds[top_idx])

        # --- METADATA ---
        # The metadata dictionary remains the same
        metadata = {
            'AKIEC': {
                'symptoms': 'Rough, scaly or crusty patches on sun-exposed skin; may be red, pink, or flesh-colored',
                'treatments': 'Cryotherapy, topical 5-fluorouracil or imiquimod, laser therapy, or surgical removal',
                'duration': 'Chronic; develops slowly over months to years'
            },
            'BCC': {
                'symptoms': 'Small shiny bump or pearly nodule, may bleed or form a scab, usually on the face or neck',
                'treatments': 'Surgical excision, Mohs surgery, cryotherapy, topical medications, or radiation therapy',
                'duration': 'Slow-growing; persists for months or years if untreated'
            },
            'BKL': {
                'symptoms': 'Waxy, raised, brown or black spots; appear “stuck-on”; usually painless and benign',
                'treatments': 'Usually none; cryotherapy, curettage, or laser removal for cosmetic reasons',
                'duration': 'Benign and long-term; remains stable or grows slowly'
            },
            'DF': {
                'symptoms': 'Firm, small nodules on arms or legs; brown or red; may dimple when pinched',
                'treatments': 'No treatment needed; surgical removal if painful or for cosmetic reasons',
                'duration': 'Persistent but benign; stable for life'
            },
            'MEL': {
                'symptoms': 'New or changing mole with irregular shape, multiple colors, or asymmetry; may bleed or itch',
                'treatments': 'Surgical excision, immunotherapy, targeted therapy, or chemotherapy if advanced',
                'duration': 'Progresses quickly if untreated; depends on stage at detection'
           },
           'NV': {
                'symptoms': 'Well-defined, round brown or black spots; uniform color and smooth edges; benign',
                'treatments': 'No treatment needed unless changes occur; surgical removal if suspicious',
                'duration': 'Lifelong; usually stable or fades slightly with age'
            },
            'VASC': {
                'symptoms': 'Red, purple, or bluish spots or nodules; may bleed easily; caused by blood vessel growth',
                'treatments': 'Laser therapy, cryotherapy, or surgical removal; some resolve on their own',
                'duration': 'Varies; some resolve within months, others persist for years'
            }
        }
        # --- END METADATA ---
        
        meta = metadata.get(label, {})
        
        return jsonify({
            'label': label,
            'probability': probability,
            'symptoms': meta.get('symptoms','No metadata available.'),
            'treatments': meta.get('treatments','No metadata available.'),
            'duration': meta.get('duration','No metadata available.')
        })
        
    except Exception as e:
        # Catch any errors during processing/prediction
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    # Running in debug mode for development; disable for production.
    app.run(host='0.0.0.0', port=5000, debug=True)