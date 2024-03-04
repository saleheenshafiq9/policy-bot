# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = ["*"]  # Add your frontend URL here

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputText(BaseModel):
    input_text: str

@app.post("/question")
def process_input_text(input_data: InputText):
    input_data.input_text = "It's working!"
    # Your processing logic here
    # Example: Just returning the input text for now
    return {"response": input_data.input_text}
