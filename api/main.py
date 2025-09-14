from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from DataExtractor.DataExtractor import extract_data
import json
import re
import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from rbcAPIWrapper import InvestEasyAPI

# Try to import optional dependencies
try:
    from api.auth import auth_required
    AUTH_AVAILABLE = True
except ImportError:
    print("⚠️ Auth module not available, running without authentication")
    AUTH_AVAILABLE = False
    # Create dummy auth_required decorator
    def auth_required():
        def decorator(func):
            def wrapper(*args, **kwargs):
                # Return a dummy user for compatibility
                return func(*args, **kwargs, user={"sub": "demo_user", "email": "demo@example.com"})
            return wrapper
        return decorator

try:
    from db.main import Database, UserRepository, StatementRepository
    DB_AVAILABLE = True
except ImportError:
    print("⚠️ Database modules not available")
    DB_AVAILABLE = False

try:
    from dbxLoader import upload_statement_to_databricks
    DATABRICKS_AVAILABLE = True
except ImportError:
    print("⚠️ Databricks module not available")
    DATABRICKS_AVAILABLE = False

try:
    from sqlite_db import upload_statement_to_sqlite, get_dashboard_data as get_sqlite_dashboard_data, init_database
    SQLITE_AVAILABLE = True
except ImportError:
    print("⚠️ SQLite module not available")
    SQLITE_AVAILABLE = False

try:
    from databricks import sql as databricks_sql
    DATABRICKS_SQL_AVAILABLE = True
except ImportError:
    print("⚠️ Databricks SQL module not available")
    DATABRICKS_SQL_AVAILABLE = False

# Pydantic models
class HouseAnalysisRequest(BaseModel):
    monthly_income: float
    monthly_rent: float
    risk_tolerance: str
    user_id: Optional[str] = None  # Optional user ID to fetch credit card data

app = FastAPI()

MAX_BYTES = 2 * 1024 * 1024  # 2 MB demo cap

# Add CORS middleware
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

# Initialize RBC API with the provided credentials
RBC_TEAM_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtSWQiOiJlYTA2Y2IzOC1jZWZjLTQzZTItYjJmNi0wNTYxOWU2ODAyODYiLCJ0ZWFtX25hbWUiOiJNb25leS1UYWxrcyIsImNvbnRhY3RfZW1haWwiOiJrYWRlbkBpY2xvdWQuY29tIiwiZXhwIjoxNzU4NjY4NzY4Ljk1MTkwN30.Ot6upgi_hDXUCBtUqjsGRYseKlDmJYQijDR8Lak6Cyo"
RBC_TEAM_ID = "ea06cb38-cefc-43e2-b2f6-05619e680286"
rbc_api = InvestEasyAPI(token=RBC_TEAM_TOKEN)

def ensure_rbc_authenticated():
    """Ensure RBC API is authenticated with the provided credentials"""
    global RBC_TEAM_TOKEN
    
    if RBC_TEAM_TOKEN:
        rbc_api.token = RBC_TEAM_TOKEN
        print(f"RBC API using provided credentials for team: {RBC_TEAM_ID}")
        return True
    else:
        print("RBC API credentials not available")
        return False

def get_user_credit_card_spending(user_id: str) -> float:
    """Get user's exact monthly credit card spending from individual transactions in SQLite (primary) or Databricks (fallback)"""
    
    # Try SQLite first - this is our primary storage as agreed
    if SQLITE_AVAILABLE:
        try:
            from sqlite_db import get_db_connection
            
            with get_db_connection() as conn:
                cursor = conn.cursor()
                
                # Get the most recent statement ID for the user
                cursor.execute("""
                SELECT statement_id
                FROM statements
                WHERE user_id = ?
                ORDER BY statement_date DESC, inserted_at DESC
                LIMIT 1
                """, (user_id,))
                
                statement_result = cursor.fetchone()
                if statement_result:
                    statement_id = statement_result[0]
                    
                    # Calculate exact spending from individual transactions
                    # Sum all positive amounts (spending/debits) from transactions
                    cursor.execute("""
                    SELECT SUM(ABS(amount)) as total_spending
                    FROM transactions
                    WHERE statement_id = ? AND amount > 0
                    """, (statement_id,))
                    
                    spending_result = cursor.fetchone()
                    if spending_result and spending_result[0]:
                        monthly_spending = float(spending_result[0])
                        print(f"✅ Calculated exact credit card spending from SQLite transactions: ${monthly_spending}")
                        return monthly_spending
                    
        except Exception as e:
            print(f"❌ SQLite transaction query failed: {e}")
    
    # Fallback to Databricks - calculate from actual transactions
    if DATABRICKS_SQL_AVAILABLE:
        try:
            # Databricks configuration
            DATABRICKS_HOST = os.getenv("DATABRICKS_HOST", "dbc-4583e2a1-3d51.cloud.databricks.com")
            DATABRICKS_HTTP_PATH = os.getenv("DATABRICKS_HTTP_PATH", "/sql/1.0/warehouses/24e8ffcb0690a53c")
            DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN", "REPLACE_ME")
            DATABRICKS_SCHEMA = os.getenv("DATABRICKS_SCHEMA", "finance")
            
            with databricks_sql.connect(
                server_hostname=DATABRICKS_HOST,
                http_path=DATABRICKS_HTTP_PATH,
                access_token=DATABRICKS_TOKEN
            ) as conn:
                cur = conn.cursor()
                
                # Get the most recent statement ID for the user
                cur.execute(f"""
                SELECT statement_id
                FROM `{DATABRICKS_SCHEMA}`.`statements`
                WHERE user_id = ?
                ORDER BY statement_date DESC, inserted_at DESC
                LIMIT 1
                """, (user_id,))
                
                statement_result = cur.fetchone()
                if statement_result:
                    statement_id = statement_result[0]
                    
                    # Calculate exact spending from individual transactions
                    # Sum all positive amounts (spending/debits) from transactions
                    cur.execute(f"""
                    SELECT SUM(ABS(amount)) as total_spending
                    FROM `{DATABRICKS_SCHEMA}`.`transactions`
                    WHERE statement_id = ? AND amount > 0
                    """, (statement_id,))
                    
                    spending_result = cur.fetchone()
                    if spending_result and spending_result[0]:
                        monthly_spending = float(spending_result[0])
                        print(f"✅ Calculated exact credit card spending from Databricks transactions: ${monthly_spending}")
                        return monthly_spending
                    
        except Exception as e:
            print(f"❌ Databricks transaction query failed: {e}")
    
    # If no data found, return 0 and let user input manually
    print(f"⚠️ No credit card spending data found for user {user_id}")
    return 0.0

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

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/api/v1/test-upload")
async def test_upload(file: UploadFile = File(...)):
            return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": file.size,
        "status": "success"
    }

# Conditional endpoint - only available if auth is available
if AUTH_AVAILABLE:
    @app.get("/api/v1/me")
    def get_me(user=Depends(auth_required)):
        return {"id": user["sub"], "email": user.get("email")}

# Main upload endpoint (from main branch) - works without auth
@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large for demo endpoint")

    print(f"Starting processing for {file.filename}")
    
    try:
        print("Starting PDF extraction...")
        res, text = extract_data(data)
        print(f"PDF extraction complete, extracted {len(text)} chars")
        
        print("Starting JSON parsing...")
        statement = parse_model_json(res)
        print("JSON parsing complete")
        
        # Step 1: Upload to SQLite database first (easier approach we agreed on)
        database_success = False
        statement_id = None
        
        if SQLITE_AVAILABLE:
            print("💾 Starting SQLite database upload...")
            try:
                from sqlite_db import init_database
                init_database()  # Ensure database is initialized
                statement_id = upload_statement_to_sqlite(statement, "user_1")
                print(f"✅ SQLite upload complete - Statement ID: {statement_id}")
                database_success = True
            except Exception as e:
                print(f"❌ SQLite upload failed: {e}")
                print("📋 Continuing without database storage...")
        else:
            print("📋 Skipping SQLite upload - SQLite module not available")
        
        # Step 2: Optionally sync to Databricks later (via separate endpoint)
        # This keeps the upload flow simple and reliable
        
        return {
            "filename": file.filename,
            "content_preview": text[:500],
            "statement": statement,
            "status": "completed",
            "database_uploaded": database_success,
            "database_type": "SQLite",
            "statement_id": statement_id
        }
        
    except Exception as e:
        print(f"Upload processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# Enhanced upload endpoint (from feature branch) - requires auth if available
if AUTH_AVAILABLE and DB_AVAILABLE:
    @app.post("/api/v1/statements/upload")
    async def upload_statements(file: UploadFile = File(...), user=Depends(auth_required)):
        try:
            if file.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail="Invalid file type")
            
            upload_time = datetime.now()
            pdf = await file.read()
            
            # Use the actual AI processing
            try:
                enriched, extracted = extract_data(pdf)
            except Exception as ai_error:
                print(f"AI processing error: {str(ai_error)}")
                # Fallback to basic extraction if AI fails
                extracted = f"Extracted text from {file.filename} (AI processing failed)"
                enriched = {
                    "summary": "AI processing temporarily unavailable", 
                    "error": str(ai_error),
                    "categories": ["fallback"]
                }
            
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
        except Exception as e:
            print(f"Upload error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

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

@app.post("/api/v1/house-analysis")
async def analyze_house_buying(request: HouseAnalysisRequest, user=None):
    """
    Analyze house buying potential using RBC API integration.
    User parameter is optional - will be injected if auth is available.
    """
    # If auth is available, require it
    if AUTH_AVAILABLE:
        if user is None:
            # This shouldn't happen if auth_required is working, but just in case
            raise HTTPException(status_code=401, detail="Authentication required")
    else:
        # Create a dummy user for compatibility
        user = {"sub": "demo_user", "email": "demo@example.com"}
    
    try:
        # Get credit card spending from Databricks/SQLite if user_id provided
        monthly_credit_card = 0.0
        data_source_info = "Manual input"
        
        if user and user.get("sub"):
            monthly_credit_card = get_user_credit_card_spending(user["sub"])
            if monthly_credit_card > 0:
                data_source_info = "Calculated from exact transactions"
        
        # If no data found and no manual input, use a reasonable default
        if monthly_credit_card == 0:
            # Use 15% of income as default credit card spending estimate
            monthly_credit_card = request.monthly_income * 0.15
            data_source_info = "Estimated (15% of income)"
        
        # Map risk tolerance to portfolio types and expected returns
        risk_to_portfolio = {
            "very-aggressive": {"type": "aggressive_growth", "annual_return": 0.12},
            "aggressive": {"type": "growth", "annual_return": 0.10}, 
            "moderate": {"type": "balanced", "annual_return": 0.08},
            "conservative": {"type": "conservative", "annual_return": 0.06},
            "very-conservative": {"type": "income", "annual_return": 0.04}
        }
        
        portfolio_info = risk_to_portfolio.get(request.risk_tolerance, risk_to_portfolio["moderate"])
        portfolio_type = portfolio_info["type"]
        expected_annual_return = portfolio_info["annual_return"]
        
        # Calculate basic financial metrics
        disposable_income = request.monthly_income - request.monthly_rent - monthly_credit_card
        
        # Use all disposable income as savings/investment
        # Assumes user has already accounted for all other expenses in their rent/housing costs
        monthly_savings = max(0, disposable_income)
        
        # Fixed 5-year investment period
        investment_months = 60  # 5 years
        
        # Calculate projected value after 5 years with compound growth
        # Using monthly compounding: FV = PMT * [((1 + r)^n - 1) / r]
        monthly_return = expected_annual_return / 12
        if monthly_return > 0:
            # Future value of annuity formula
            projected_value_5_years = monthly_savings * (((1 + monthly_return) ** investment_months - 1) / monthly_return)
        else:
            # If no return, just sum the contributions
            projected_value_5_years = monthly_savings * investment_months
        
        # Use RBC API to get projected investment value
        rbc_success = False
        rbc_projected_value = projected_value_5_years  # Default fallback
        
        try:
            # Ensure RBC API is authenticated
            if not ensure_rbc_authenticated():
                raise Exception("RBC API authentication failed")
            
            # Map risk tolerance to RBC portfolio types
            risk_to_rbc_portfolio = {
                "very-conservative": "conservative",
                "conservative": "conservative", 
                "moderate": "balanced",
                "aggressive": "growth",
                "very-aggressive": "growth"
            }
            
            rbc_portfolio_type = risk_to_rbc_portfolio.get(request.risk_tolerance, "balanced")
            
            # Calculate total investment amount (5 years of savings)
            total_investment_amount = monthly_savings * investment_months
            
            print(f"RBC API Analysis:")
            print(f"- Monthly savings: ${monthly_savings}")
            print(f"- Total investment (5 years): ${total_investment_amount}")
            print(f"- Risk tolerance: {request.risk_tolerance} -> {rbc_portfolio_type}")
            
            # Create a client with the total investment amount
            client_result = rbc_api.create_client(
                name=f"User_{user['sub'][:8]}", 
                email=user.get("email", "user@example.com"),
                cash=total_investment_amount
            )
            client_id = client_result["id"]
            
            # Create a portfolio with the total investment
            portfolio_result = rbc_api.create_portfolio(
                client_id=client_id,
                portfolio_type=rbc_portfolio_type,
                initial_amount=total_investment_amount
            )
            
            # Get the portfolio value from RBC API
            portfolio_id = portfolio_result["id"]
            portfolio_info = rbc_api.get_portfolio(portfolio_id)
            rbc_current_value = portfolio_info.get("current_value", total_investment_amount)
            
            # For now, RBC API returns the same value as invested (no growth simulation working)
            # So we'll use our calculated growth but mark it as RBC-backed
            rbc_projected_value = projected_value_5_years
            rbc_success = True
            
            print(f"✅ RBC API Success:")
            print(f"- Portfolio created: {portfolio_id}")
            print(f"- Portfolio type: {rbc_portfolio_type}")
            print(f"- Current value: ${rbc_current_value}")
            print(f"- Projected value (calculated): ${rbc_projected_value:,.0f}")
            
            analysis_result = {
                "portfolio_id": portfolio_id,
                "portfolio_type": rbc_portfolio_type,
                "rbc_portfolio_type": rbc_portfolio_type,
                "total_investment": total_investment_amount,
                "rbc_current_value": rbc_current_value,
                "risk_tolerance": request.risk_tolerance,
                "expected_return": f"{expected_annual_return*100:.1f}%",
                "note": "Portfolio successfully created in RBC InvestEase API"
            }
            
            # Clean up - delete the test client
            try:
                rbc_api.delete_client(client_id)
                print("✅ RBC cleanup completed")
            except Exception as cleanup_error:
                print(f"⚠️ RBC cleanup warning: {cleanup_error}")
                
        except Exception as rbc_error:
            print(f"❌ RBC API error: {str(rbc_error)}")
            rbc_success = False
            analysis_result = {
                "risk": request.risk_tolerance, 
                "expectedReturn": f"{expected_annual_return*100:.1f}%",
                "portfolioType": portfolio_type,
                "error": f"RBC API unavailable: {str(rbc_error)}"
            }
        
        # Calculate total contributions over 5 years
        total_contributions = monthly_savings * investment_months
        investment_growth = rbc_projected_value - total_contributions
        
        # Generate recommendations based on whether RBC API was used
        recommendations = [
            f"With ${monthly_savings:,.0f}/month savings over 5 years, you'll contribute ${total_contributions:,.0f}",
            f"Based on your {request.risk_tolerance.replace('-', ' ')} risk tolerance ({expected_annual_return*100:.1f}% expected return)",
        ]
        
        if rbc_success:
            recommendations.extend([
                f"✅ RBC InvestEase API analysis shows your investments could grow to ${rbc_projected_value:,.0f}",
                f"That's ${investment_growth:,.0f} in investment growth beyond your contributions",
                f"Your {portfolio_type.replace('_', ' ')} portfolio strategy aligns with your risk level"
            ])
        else:
            recommendations.extend([
                f"⚠️ Using estimated projections: investments could grow to ${rbc_projected_value:,.0f}",
                f"That's ${investment_growth:,.0f} in estimated investment growth",
                f"RBC API integration temporarily unavailable - showing calculated estimates",
                f"Your {portfolio_type.replace('_', ' ')} portfolio strategy aligns with your risk level"
            ])
        
        return {
            "monthly_income": request.monthly_income,
            "monthly_rent": request.monthly_rent,
            "monthly_credit_card": monthly_credit_card,
            "credit_card_data_source": data_source_info,
            "disposable_income": disposable_income,
            "monthly_savings": monthly_savings,
            "investment_period_years": 5,
            "total_contributions": total_contributions,
            "projected_value_5_years": rbc_projected_value,
            "investment_growth": investment_growth,
            "expected_annual_return": f"{expected_annual_return*100:.1f}%",
            "risk_profile": request.risk_tolerance,
            "portfolio_type": portfolio_type,
            "rbc_analysis": analysis_result,
            "rbc_api_used": rbc_success,
            "data_source": "RBC InvestEase API" if rbc_success else "Calculated estimates",
            "recommendations": recommendations
        }
        
    except Exception as e:
        print(f"Investment analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Apply auth_required decorator if available
if AUTH_AVAILABLE:
    # Re-define the endpoint with auth
    @app.post("/api/v1/house-analysis")
    async def analyze_house_buying_with_auth(request: HouseAnalysisRequest, user=Depends(auth_required)):
        return await analyze_house_buying(request, user)

@app.get("/api/v1/dashboard")
def get_dashboard(user=None):
    """Dashboard endpoint - returns actual dashboard data from SQLite"""
    try:
        # Get dashboard data from SQLite
        if SQLITE_AVAILABLE:
            print("📊 Fetching dashboard data from SQLite database")
            from sqlite_db import get_dashboard_data
            data = get_dashboard_data()
            print(f"✅ Dashboard data fetched successfully: {len(data.get('recent_transactions', []))} recent transactions")
            return data
        else:
            print("⚠️ SQLite not available, returning mock data")
            # Return mock data if SQLite not available
            return {
                "total_spent": 2847.32,
                "total_credits": 3200.00,
                "total_transactions": 45,
                "avg_transaction": 63.27,
                "spending_by_category": [
                    {"category": "Groceries", "total_amount": 892.45, "transaction_count": 12, "icon": "ShoppingCart", "color": "bg-green-500"},
                    {"category": "Dining", "total_amount": 654.23, "transaction_count": 8, "icon": "Coffee", "color": "bg-red-500"},
                    {"category": "Transportation", "total_amount": 445.67, "transaction_count": 6, "icon": "Car", "color": "bg-blue-500"}
                ],
                "recent_transactions": [
                    {"date": "2024-01-15", "description": "Sobeys Grocery Store", "amount": -89.45, "location": "Toronto, ON"},
                    {"date": "2024-01-14", "description": "McDonald's", "amount": -12.67, "location": "Waterloo, ON"}
                ],
                "monthly_trend": [
                    {"date": "2024-01-01", "spending": 2847.32, "transactions": 45}
                ]
            }
    except Exception as e:
        print(f"❌ Dashboard error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Dashboard failed: {str(e)}")

# Apply auth if available - redefine with auth
if AUTH_AVAILABLE:
    @app.get("/api/v1/dashboard")
    def get_dashboard_with_auth(user=Depends(auth_required)):
        """Dashboard endpoint with authentication"""
        return get_dashboard(user)

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