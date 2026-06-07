# models/risk.py

def assess_risk(severity: str, duration: int, age: int) -> str:
    severity = severity.lower()

    if severity == "severe":
        return "High"

    if severity == "moderate" and duration >= 3:
        return "Medium"

    if age > 60 and duration >= 2:
        return "Medium"

    return "Low"