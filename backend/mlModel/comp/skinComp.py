import cv2
import numpy as np

from chatModel.bot import skinCancerRecGenerator

def _get_area_from_bytes(image_bytes):
    """Internal helper: Decodes bytes and calculates lesion area."""
    # Convert bytes to numpy array and decode
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return 0

    # Preprocessing & Segmentation
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (7, 7), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Find Contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return 0
        
    # Get largest contour area
    largest_contour = max(contours, key=cv2.contourArea)
    return cv2.contourArea(largest_contour)

def calculate_cancer_progression(old_bytes, new_bytes):
    """Main logic function called by the API."""
    area_old = _get_area_from_bytes(old_bytes)
    area_new = _get_area_from_bytes(new_bytes)

    # Safety check
    if area_old == 0 or area_new == 0:
        return {"error": "Could not detect lesion in one or both images."}

    # Calculate Growth
    growth_percent = ((area_new - area_old) / area_old) * 100
    
    # Determine Severity
    status = "Stable"
    severity = "low"
    if growth_percent > 10.0:
        status = "Significant Growth"
        severity = "high"
    elif growth_percent > 5.0:
        status = "Minor Growth"
        severity = "medium"
    elif growth_percent < -5.0:
        status = "Regression (Shrinkage)"
    
    text = f"metrics : (old_area_px : {area_old} , new_area_px : {area_new}, growth_percentage : {round(growth_percent, 2)}) , diagnosis : (status : {status}, severity : {severity}, is_dangerous : {severity == "high"})"
    response = skinCancerRecGenerator(text)

    return {
        "success": True,
        "metrics": {
            "old_area_px": area_old,
            "new_area_px": area_new,
            "growth_percentage": round(growth_percent, 2)
        },
        "diagnosis": {
            "status": status,
            "severity": severity,
            "is_dangerous": severity == "high"
        },
        "ai_analysis" : response
    }