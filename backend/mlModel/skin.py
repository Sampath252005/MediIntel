import tensorflow as tf
import numpy as np
import os
import io
import skfuzzy as fuzz
from skfuzzy import control as ctrl
from tensorflow.keras import layers, Sequential # type: ignore
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPool2D # type: ignore
from PIL import Image

# Import your chat generator
try:
    from chatModel.bot import skinCancerRecGenerator
except ImportError:
    def skinCancerRecGenerator(text): return "AI advice generator not connected."

# --- Configuration ---
IMG_HEIGHT = 180
IMG_WIDTH = 180
MODEL_PATH = '/home/sushanth/Coading/MediIntel/backend/mlModel/cnn_fc_model.h5'

CLASS_NAMES = [
    'actinic keratosis', 'basal cell carcinoma', 'dermatofibroma', 
    'melanoma', 'nevus', 'pigmented benign keratosis', 
    'seborrheic keratosis', 'squamous cell carcinoma', 'vascular lesion'
]

DISEASE_SEVERITY = {
    'melanoma': 10, 'basal cell carcinoma': 8, 'squamous cell carcinoma': 8,
    'actinic keratosis': 6, 'vascular lesion': 5, 'dermatofibroma': 3,
    'pigmented benign keratosis': 2, 'seborrheic keratosis': 2, 'nevus': 1
}

# --- 1. Initialize Systems (Runs once on import) ---

def build_fuzzy_system():
    # Antecedents
    confidence = ctrl.Antecedent(np.arange(0, 101, 1), 'confidence')
    severity = ctrl.Antecedent(np.arange(0, 11, 1), 'severity')
    # Consequent
    urgency = ctrl.Consequent(np.arange(0, 11, 1), 'urgency')

    # Membership Functions
    confidence['low'] = fuzz.trimf(confidence.universe, [0, 0, 50])
    confidence['medium'] = fuzz.trimf(confidence.universe, [30, 60, 80])
    confidence['high'] = fuzz.trimf(confidence.universe, [70, 100, 100])

    severity['benign'] = fuzz.trimf(severity.universe, [0, 0, 4])
    severity['suspicious'] = fuzz.trimf(severity.universe, [3, 5, 7])
    severity['malignant'] = fuzz.trimf(severity.universe, [6, 10, 10])

    urgency['routine'] = fuzz.trimf(urgency.universe, [0, 0, 4])
    urgency['consult_soon'] = fuzz.trimf(urgency.universe, [3, 5, 8])
    urgency['immediate_action'] = fuzz.trimf(urgency.universe, [7, 10, 10])

    # Rules
    rule1 = ctrl.Rule(severity['malignant'] & confidence['high'], urgency['immediate_action'])
    rule2 = ctrl.Rule(severity['benign'] & confidence['high'], urgency['routine'])
    rule3 = ctrl.Rule(severity['suspicious'] | confidence['low'], urgency['consult_soon'])
    rule4 = ctrl.Rule(severity['malignant'] & confidence['medium'], urgency['consult_soon'])

    urgency_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4])
    return ctrl.ControlSystemSimulation(urgency_ctrl)

def load_cnn_model():
    model = Sequential([layers.Rescaling(1.0/255, input_shape=(IMG_HEIGHT, IMG_WIDTH, 3))])
    model.add(Conv2D(32, 3, padding="same", activation='relu'))
    model.add(MaxPool2D())
    model.add(Conv2D(64, 3, padding="same", activation='relu'))
    model.add(MaxPool2D())
    model.add(Conv2D(128, 3, padding="same", activation='relu'))
    model.add(MaxPool2D())
    model.add(Dropout(0.15))
    model.add(Conv2D(256, 3, padding="same", activation='relu'))
    model.add(MaxPool2D())
    model.add(Dropout(0.20))
    model.add(Conv2D(512, 3, padding="same", activation='relu'))
    model.add(MaxPool2D())
    model.add(Dropout(0.25))
    model.add(Flatten())
    model.add(Dense(1024, activation="relu"))
    model.add(Dense(len(CLASS_NAMES), activation='softmax'))
    
    try:
        model.load_weights(MODEL_PATH)
        print("✅ CNN Weights loaded.")
        return model
    except Exception as e:
        print(f"❌ Error loading weights: {e}")
        return None

# Global Instances
fuzzy_sim = build_fuzzy_system()
cnn_model = load_cnn_model()

# --- 2. Processing Logic ---

def process_skin_image(image_bytes):
    """
    Takes raw image bytes, runs CNN + Fuzzy Logic, returns a Dictionary.
    """
    if cnn_model is None:
        raise Exception("Model is not loaded.")

    # A. Preprocessing
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((IMG_HEIGHT, IMG_WIDTH))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    # B. CNN Prediction
    predictions = cnn_model.predict(img_array, verbose=0)
    predicted_idx = np.argmax(predictions[0])
    predicted_class = CLASS_NAMES[predicted_idx]
    cnn_confidence = float(100 * np.max(predictions[0]))

    # C. Fuzzy Logic Calculation
    severity_score = DISEASE_SEVERITY.get(predicted_class, 5)
    
    fuzzy_sim.input['confidence'] = cnn_confidence
    fuzzy_sim.input['severity'] = severity_score
    fuzzy_sim.compute()
    urgency_score = float(fuzzy_sim.output['urgency'])

    # D. Determine Action
    action_short = ""
    if urgency_score < 4:
        action_short = "Routine Checkup"
    elif urgency_score < 7:
        action_short = "Consult Doctor Soon"
    else:
        action_short = "Immediate Specialist Attention"

    # E. Generate Text Analysis
    context_text = (
        f"CNN Diagnosis:{predicted_class}, "
        f"CNN Confidence:{cnn_confidence:.2f}%, "
        f"Medical Risk:{severity_score}/10, "
        f"Fuzzy Urgency:{urgency_score:.2f}/10, "
        f"ACTION:{action_short}"
    )
    ai_advice = skinCancerRecGenerator(context_text)

    return {
        "diagnosis": predicted_class,
        "confidence_score": round(cnn_confidence, 2),
        "severity_level": severity_score,
        "urgency_score": round(urgency_score, 2),
        "recommended_action": action_short,
        "ai_analysis": ai_advice
    }