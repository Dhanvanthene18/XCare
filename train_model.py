import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import joblib

# -----------------------------
# LOAD DATASET
# -----------------------------
df = pd.read_csv("dataset.csv")

# Fill empty cells
df.fillna("", inplace=True)

# -----------------------------
# GET SYMPTOMS
# -----------------------------
symptom_columns = df.columns[1:]

# Convert row symptoms into list
symptoms_list = []

for _, row in df.iterrows():
    symptoms = []

    for col in symptom_columns:
        symptom = str(row[col]).strip()

        if symptom != "":
            symptoms.append(symptom.lower())

    symptoms_list.append(symptoms)

# -----------------------------
# ENCODE SYMPTOMS
# -----------------------------
mlb = MultiLabelBinarizer()

X = mlb.fit_transform(symptoms_list)

# Disease labels
y = df["Disease"]

# -----------------------------
# SPLIT DATA
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# -----------------------------
# TRAIN MODEL
# -----------------------------
model = DecisionTreeClassifier()

model.fit(X_train, y_train)

# -----------------------------
# ACCURACY
# -----------------------------
accuracy = model.score(X_test, y_test)

print(f"Model Accuracy: {accuracy * 100:.2f}%")

# -----------------------------
# SAVE MODEL
# -----------------------------
joblib.dump(model, "disease_model.pkl")
joblib.dump(mlb, "symptom_encoder.pkl")

print("Model saved successfully!")