from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

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

class ResponseData(BaseModel):
    response: str
    source: str

@app.post("/question", response_model=ResponseData)
def process_input_text(input_data: InputText):
    # Check for specific input texts and return different responses
    if input_data.input_text.lower() == 'hi':
        time.sleep(2)  # Add a 3-second delay
        return {"response": "New message is incoming", "source": "Bot"}
    elif input_data.input_text.lower() == 'hello':
        time.sleep(2)  # Add a 3-second delay
        return {"response": "Hello there!", "source": "Bot"}
    else:
        time.sleep(2)  # Add a 3-second delay
        input_data.input_text = "It's working!"
        # Your default processing logic here
        # Example: Just returning the input text for now
        return {"response": input_data.input_text, "source": "Default"}
