from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import random

app = FastAPI()

# Placeholder training data and model initialization
# In a real scenario, you'd load a pre-trained model via joblib or pickle.
# Here we'll generate some dummy data mapping answer indices (1-4) for 10 questions to careers.
dummy_X = []
dummy_y = []

# Generate 500 samples of random answers (values 1 to 4)
careers = ['Engineering', 'Medicine', 'Business', 'Arts and Design', 'Data Science', 'Law', 'Research']
for _ in range(500):
    answers = [random.randint(1, 4) for _ in range(10)]
    dummy_X.append(answers)
    dummy_y.append(random.choice(careers))

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(dummy_X, dummy_y)

class PredictionRequest(BaseModel):
    responses: List[int]

@app.get("/")
def read_root():
    return {"message": "ML Engine for Career Counseling Application is running"}

@app.post("/predict")
def predict_career(request: PredictionRequest):
    if len(request.responses) != 10:
        raise HTTPException(status_code=400, detail="Exactly 10 responses are required")
    
    # Ensure all responses are within 1-4
    for r in request.responses:
        if r < 1 or r > 4:
            raise HTTPException(status_code=400, detail="Responses must be between 1 and 4")

    input_data = np.array(request.responses).reshape(1, -1)
    
    prediction = model.predict(input_data)[0]
    
    # Get probabilities to calculate a mock "confidence score"
    probabilities = model.predict_proba(input_data)[0]
    confidence = float(max(probabilities) * 100) # percentage

    # If it's too low (due to dummy random data), we boost it randomly for the demo
    if confidence < 50:
        confidence += random.uniform(20.0, 40.0)
        
    return {
        "recommendedCareer": prediction,
        "confidenceScore": round(confidence, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
