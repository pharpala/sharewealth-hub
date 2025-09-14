from fastapi import FastAPI, UploadFile, File, HTTPException
from DataExtractor.DataExtractor import extract_data
from dbxLoader import upload_statement_to_databricks
import json
import re

app = FastAPI()

MAX_BYTES = 2 * 1024 * 1024  # 2 MB demo cap

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _strip_code_fences(s: str) -> str:
    s = s.strip()
    # remove ```json ... ``` or ``` ... ``` fences if the model added them
    if s.startswith("```"):
        s = re.sub(r"^```(?:json)?\s*", "", s)
        s = re.sub(r"\s*```$", "", s)
    return s

def parse_model_json(res) -> dict:
    """
    Extract JSON payload from a Chat Completions–style response like the one you printed.
    Falls back to common shapes if the SDK returns a different structure.
    """
    # 1) Try classic chat.completions shape
    try:
        content = res["choices"][0]["message"]["content"]
    except Exception:
        # 2) Some SDKs expose helper properties or 'output_text'
        content = getattr(res, "output_text", None)
        if content is None:
            # 3) Last resort: stringify and try to pull the biggest {...} block
            content = json.dumps(res)

    if isinstance(content, list):
        # Some SDKs may return a list of content parts
        # Join only the text parts
        content = "".join(part.get("text", "") if isinstance(part, dict) else str(part)
                          for part in content)

    content = _strip_code_fences(str(content))
    # Now parse to Python dict
    return json.loads(content)


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large for demo endpoint")

    res, text = extract_data(data)

    # Convert model string → dict
    try:
        statement = parse_model_json(res)
    except Exception as e:
        # Helpful diagnostics if parsing fails
        raise HTTPException(status_code=500, detail=f"Failed to parse model JSON: {e}")

    # Pretty-print to logs (optional)
    print(f"Extracted {len(text)} chars from {file.filename}")
    print(json.dumps(statement, indent=2, ensure_ascii=False))
    upload_statement_to_databricks(statement, "1")

    return {
        "filename": file.filename,
        "content_preview": text[:500],  # don’t blast full text back if large
        "statement": statement          # ✅ clean JSON object
    }

if __name__ == "__main__":
    # Run: python main.py
    # Tip: set HOST/PORT/RELOAD env vars as needed
    import os
    import uvicorn

    host = os.getenv("HOST", "127.0.0.1")     # use "0.0.0.0" inside Docker/VM
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "1") == "1"  # turn off in prod

    # For reload=True, pass an import string ("module:app") so Uvicorn can re-import.
    # If this file is main.py at the project root, "main:app" works.
    app_ref = "main:app" if reload else app

    uvicorn.run(app_ref, host=host, port=port, reload=reload)
