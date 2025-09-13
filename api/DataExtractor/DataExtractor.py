from DataExtractor.pdfReader import extract_pdf_text
from martianAPIWrapper import MartianClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MartianClient(os.getenv("MARTIAN_KEY"))

def extract_data(pdf):
    text = extract_pdf_text(pdf)
    with open("DataExtractor/dataIsolation.prompt", "r") as file:
        prompt = file.read()
    messages = [
        {"role": "user", "content": prompt + text},
    ]
    response = client.chat_completions(
        model="openai/gpt-4.1-nano:cheap",
        messages=messages
    )
    return response
    
