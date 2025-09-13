from fastapi import FastAPI, Depends
from auth import auth_required

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/v1/me")
def get_me(user=Depends(auth_required)):
    return {"id": user["sub"], "email": user.get("email")}

@app.post("/api/v1/statements/upload")
def upload_statements(user=Depends(auth_required)):
    pass

@app.get("/api/v1/statements/list")
def list_statements(user=Depends(auth_required)):
    pass

@app.get("/api/v1/statements/{id}")
def get_statement(id: str, user=Depends(auth_required)):
    pass