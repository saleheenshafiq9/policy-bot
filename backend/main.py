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
    # Check for specific input texts and return different responses
    if input_data.input_text.lower() == 'hi':
        return {"response": "New message is incoming"}
    elif input_data.input_text.lower() == 'hello':
        return {"response": "Hello there!"}
    else:
        input_data.input_text = "It's working!"
        # Your default processing logic here
        # Example: Just returning the input text for now
        return {"response": input_data.input_text}
