import pandas as pd

# -----------------------------
# LOAD CSV FILES
# -----------------------------
description_df = pd.read_csv(
    "../Dataset/symptom_Description.csv"
)

precaution_df = pd.read_csv(
    "../Dataset/symptom_precaution.csv"
)

# -----------------------------
# CUSTOM DISEASE DESCRIPTIONS
# -----------------------------
custom_descriptions = {

    "Respiratory Infection":
    "A respiratory infection affects the lungs and airways, causing breathing difficulties, cough, and congestion.",

    "Heart Disease":
    "Heart disease refers to conditions affecting the heart and blood vessels, often causing chest pain and fatigue.",

    "Cardiac Issue":
    "Cardiac issues may affect heart function and can cause chest pain, shortness of breath, and fatigue.",

    "Viral Fever":
    "Viral fever is caused by viral infections and commonly includes fever, headache, and body pain.",

    "Migraine":
    "Migraine is a neurological condition that causes severe headaches, nausea, and sensitivity to light.",

    "Diabetes":
    "Diabetes is a condition that affects blood sugar regulation and may cause fatigue, thirst, and frequent urination.",

    "Hypertension":
    "Hypertension is high blood pressure that can increase the risk of heart disease and stroke.",

    "Food Poisoning":
    "Food poisoning occurs due to contaminated food and may cause vomiting, stomach pain, and diarrhea.",

    "Common Cold":
    "Common cold is a viral infection affecting the nose and throat, leading to cough and congestion.",

    "Fungal Infection":
    "Fungal infections affect the skin and may cause itching, redness, and skin irritation.",

    "Arthritis":
    "Arthritis is the inflammation of joints causing pain, swelling, and stiffness.",

    "Allergy":
    "Allergies occur when the immune system reacts to substances like dust, pollen, or food."
}

# -----------------------------
# CUSTOM PRECAUTIONS
# -----------------------------
custom_precautions = {

    "Respiratory Infection": [
        "Drink warm fluids",
        "Take proper rest",
        "Avoid cold exposure",
        "Consult doctor if breathing worsens"
    ],

    "Heart Disease": [
        "Avoid stress",
        "Maintain healthy diet",
        "Seek immediate medical attention",
        "Avoid heavy physical activity"
    ],

    "Cardiac Issue": [
        "Avoid physical exertion",
        "Monitor chest discomfort",
        "Maintain calm and rest",
        "Seek immediate medical attention"
    ],

    "Viral Fever": [
        "Drink plenty of fluids",
        "Take adequate rest",
        "Monitor body temperature",
        "Consult doctor if fever persists"
    ],

    "Migraine": [
        "Rest in a dark quiet room",
        "Stay hydrated",
        "Avoid stress",
        "Consult doctor if headaches persist"
    ],

    "Diabetes": [
        "Monitor blood sugar regularly",
        "Maintain healthy diet",
        "Exercise regularly",
        "Take medications as prescribed"
    ],

    "Hypertension": [
        "Reduce salt intake",
        "Exercise regularly",
        "Avoid stress",
        "Monitor blood pressure"
    ],

    "Food Poisoning": [
        "Stay hydrated",
        "Avoid outside food",
        "Eat light meals",
        "Consult doctor if symptoms worsen"
    ],

    "Common Cold": [
        "Drink warm water",
        "Take rest",
        "Use steam inhalation",
        "Avoid cold drinks"
    ],

    "Fungal Infection": [
        "Maintain skin hygiene",
        "Keep affected area dry",
        "Avoid scratching",
        "Use antifungal medication"
    ],

    "Arthritis": [
        "Exercise regularly",
        "Use hot and cold therapy",
        "Avoid excessive strain",
        "Consult orthopedic specialist if needed"
    ],

    "Allergy": [
        "Avoid allergens",
        "Keep surroundings clean",
        "Use prescribed antihistamines",
        "Consult doctor if symptoms worsen"
    ]
}

# -----------------------------
# GET DESCRIPTION
# -----------------------------
def get_description(disease):

    # CUSTOM DATA FIRST
    if disease in custom_descriptions:
        return custom_descriptions[disease]

    # CSV SEARCH
    row = description_df[
        description_df["Disease"].str.lower() == disease.lower()
    ]

    if not row.empty:
        return row.iloc[0]["Description"]

    return "No description available."

# -----------------------------
# GET PRECAUTIONS
# -----------------------------
def get_precautions(disease):

    # CUSTOM DATA FIRST
    if disease in custom_precautions:
        return custom_precautions[disease]

    # CSV SEARCH
    row = precaution_df[
        precaution_df["Disease"].str.lower() == disease.lower()
    ]

    if not row.empty:

        precautions = []

        for i in range(1, 5):

            col = f"Precaution_{i}"

            if col in row.columns:

                value = row.iloc[0][col]

                if pd.notna(value):
                    precautions.append(value)

        return precautions

    return ["No precautions available."]