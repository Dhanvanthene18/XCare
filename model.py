from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

from .training_data import TRAINING_DATA

# Prepare data
texts = [" ".join(d["symptoms"]) for d in TRAINING_DATA]
labels = [d["category"] for d in TRAINING_DATA]

# Vectorize
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

# Train model
model = MultinomialNB()
model.fit(X, labels)


def predict_category(symptoms: list[str]):
    text = " ".join(symptoms)
    vec = vectorizer.transform([text])
    return model.predict(vec)[0]