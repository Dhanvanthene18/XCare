import joblib

# -----------------------------
# LOAD MODEL + ENCODER
# -----------------------------
model = joblib.load("ml/disease_model.pkl")

encoder = joblib.load("ml/symptom_encoder.pkl")

# -----------------------------
# SMART PREDICTION
# -----------------------------
def predict_disease(symptoms_text):

    symptoms = [
        s.strip().lower()
        for s in symptoms_text.split(",")
    ]

    symptoms_set = set(symptoms)

    # =====================================
    # SMART MEDICAL RULES
    # =====================================

    # FEVER CASES
    if "fever" in symptoms_set and "headache" in symptoms_set:
        return "Viral Fever"

    if "fever" in symptoms_set:
        return "Viral Fever"

    # RESPIRATORY
    if "breathing problem" in symptoms_set:
        return "Respiratory Infection"

    if "cough" in symptoms_set:
        return "Common Cold"

    # CARDIAC
    if "chest pain" in symptoms_set:
        return "Heart Disease"

    # SKIN
    if "skin rash" in symptoms_set:
        return "Fungal Infection"

    # DIGESTIVE
    if "vomiting" in symptoms_set:
        return "Food Poisoning"

    # =====================================
    # ML MODEL PREDICTION
    # =====================================

    try:

        encoded = encoder.transform([symptoms])

        prediction = model.predict(encoded)[0]

        return prediction

    except:

        return "General Health Condition"