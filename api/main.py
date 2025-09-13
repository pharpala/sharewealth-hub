from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from api.auth import auth_required
from datetime import datetime
from DataExtractor.DataExtractor import extract_data
from db.main import Database, UserRepository, StatementRepository
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/v1/me")
def get_me(user=Depends(auth_required)):
    return {"id": user["sub"], "email": user.get("email")}

@app.post("/api/v1/statements/upload")
async def upload_statements(file: UploadFile = File(...), user=Depends(auth_required)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type")
    upload_time = datetime.now()
    pdf = await file.read()
    enriched, extracted = extract_data(pdf)
    
    # Create database session and repositories
    db = Database()
    user_repo = UserRepository(db)
    statement_repo = StatementRepository(db)
    
    # Ensure user exists in database
    user_repo.get_or_create(
        auth0_id=user["sub"],
        email=user.get("email", ""),
        name=user.get("name", "")
    )
    
    # Create statement
    statement = statement_repo.create(user["sub"], upload_time, extracted, enriched)
    
    # Extract statement ID before closing session
    statement_id = statement.id
    
    db.close()
    return {
        "statement_id": statement_id,
        "status": "uploaded",
        "datetime_uploaded": upload_time.isoformat(),
        "summary": enriched.get("summary") if isinstance(enriched, dict) else None
    }

@app.get("/api/v1/statements/list")
def list_statements(user=Depends(auth_required)):
    db = Database()
    statement_repo = StatementRepository(db)
    statements = statement_repo.list_by_user(user["sub"])
    db.close()
    return [
        {
            "id": s.id,
            "status": s.status,
            "uploaded_at": s.uploaded_at.isoformat(),
            "summary": s.enriched_data.get("summary") if isinstance(s.enriched_data, dict) else None
        }
        for s in statements
    ]

@app.get("/api/v1/statements/{id}")
def get_statement(id: str, user=Depends(auth_required)):
    db = Database()
    statement_repo = StatementRepository(db)
    statement = statement_repo.get_by_id(user["sub"], id)
    db.close()
    if not statement:
        raise HTTPException(status_code=404, detail="Statement not found")
    return {
        "id": statement.id,
        "status": statement.status,
        "uploaded_at": statement.uploaded_at.isoformat(),
        "text_extracted": statement.text_extracted,
        "enriched_data": statement.enriched_data
    }