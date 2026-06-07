# models/decision.py

def generate_decision(risk: str):
    if risk == "High":
        return {
            "immediate_steps": "Seek medical attention immediately.",
            "home_care": "Avoid self-medication.",
            "warning_signs": "Breathing difficulty, chest pain, confusion.",
            "recommendation": "Visit hospital / emergency care."
        }

    if risk == "Medium":
        return {
            "immediate_steps": "Monitor symptoms closely.",
            "home_care": "Rest, hydration, basic medication if prescribed.",
            "warning_signs": "Fever persisting >3 days, worsening pain.",
            "recommendation": "Consult a doctor within 24–48 hours."
        }

    return {
        "immediate_steps": "No urgent action required.",
        "home_care": "Rest, hydration, healthy diet.",
        "warning_signs": "Symptoms worsening unexpectedly.",
        "recommendation": "Home care sufficient for now."
    }