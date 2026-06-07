# models/patient.py

from pydantic import BaseModel
from typing import List

class PatientInput(BaseModel):
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    symptoms: List[str]
    duration_days: int
    severity: str