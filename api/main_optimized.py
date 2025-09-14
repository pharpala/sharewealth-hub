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

try:
    from sqlite_db import upload_statement_to_sqlite, get_dashboard_data as get_sqlite_dashboard_data, init_database
    SQLITE_AVAILABLE = True
except ImportError:
    print("⚠️ SQLite module not available")
    SQLITE_AVAILABLE = False

# Pydantic models
class HouseAnalysisRequest(BaseModel):
    monthly_income: float
    monthly_rent: float
    risk_tolerance: str
    user_id: Optional[str] = None

class HouseSearchRequest(BaseModel):
    location: str
    downpayment: float
    leverage: Optional[int] = 5

app = FastAPI()

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
RBC_TEAM_ID = "ea06cb38-cefc-43e2-b2f6-05619e680286"
RBC_TEAM_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtSWQiOiJlYTA2Y2IzOC1jZWZjLTQzZTItYjJmNi0wNTYxOWU2ODAyODYiLCJ0ZWFtX25hbWUiOiJNb25leS1UYWxrcyIsImNvbnRhY3RfZW1haWwiOiJrYWRlbkBpY2xvdWQuY29tIiwiZXhwIjoxNzU4NjY4NzY4Ljk1MTkwN30.Ot6upgi_hDXUCBtUqjsGRYseKlDmJYQijDR8Lak6Cyo"
RBC_EXPIRES_AT = "2025-09-23T23:06:08.951907Z"
rbc_api = InvestEasyAPI(token=RBC_TEAM_TOKEN)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/api/v1/house-analysis")
async def analyze_house_buying(request: HouseAnalysisRequest):
    """Fast house buying analysis with optimized RBC API integration"""
    import time
    start_time = time.time()
    
    try:
        print(f"🏠 Starting house analysis for income: ${request.monthly_income}")
        
        # Simple credit card calculation (skip database for speed)
        monthly_credit_card = request.monthly_income * 0.15
        print(f"💳 Credit card estimate: ${monthly_credit_card}")
        
        # Calculate basic metrics
        disposable_income = request.monthly_income - request.monthly_rent - monthly_credit_card
        monthly_savings = max(0, disposable_income)
        investment_months = 60  # 5 years
        total_contributions = monthly_savings * investment_months
        
        # Map risk tolerance to returns
        risk_returns = {
            "very-aggressive": 0.12,
            "aggressive": 0.10,
            "moderate": 0.08,
            "conservative": 0.06,
            "very-conservative": 0.04
        }
        expected_annual_return = risk_returns.get(request.risk_tolerance, 0.08)
        
        # Calculate projected value with compound growth
        monthly_return = expected_annual_return / 12
        if monthly_return > 0:
            projected_value_5_years = monthly_savings * (((1 + monthly_return) ** investment_months - 1) / monthly_return)
        else:
            projected_value_5_years = total_contributions
        
        investment_growth = projected_value_5_years - total_contributions
        
        # Quick RBC API integration (should be fast)
        rbc_success = False
        portfolio_id = None
        
        try:
            print("🚀 Quick RBC API call...")
            rbc_start = time.time()
            
            # Single optimized RBC call
            client_result = rbc_api.create_client(
                name="Demo User", 
                email="demo@example.com",
                cash=total_contributions
            )
            client_id = client_result["id"]
            
            portfolio_result = rbc_api.create_portfolio(
                client_id=client_id,
                portfolio_type="balanced",
                initial_amount=total_contributions
            )
            portfolio_id = portfolio_result["id"]
            
            # Cleanup immediately
            rbc_api.delete_client(client_id)
            
            rbc_success = True
            print(f"✅ RBC API completed in {time.time() - rbc_start:.2f}s")
            
        except Exception as rbc_error:
            print(f"⚠️ RBC API failed: {rbc_error}")
            rbc_success = False
        
        # Generate response
        response = {
            "monthly_income": request.monthly_income,
            "monthly_rent": request.monthly_rent,
            "monthly_credit_card": monthly_credit_card,
            "credit_card_data_source": "Estimated (15% of income)",
            "disposable_income": disposable_income,
            "monthly_savings": monthly_savings,
            "investment_period_years": 5,
            "total_contributions": total_contributions,
            "projected_value_5_years": projected_value_5_years,
            "investment_growth": investment_growth,
            "expected_annual_return": f"{expected_annual_return*100:.1f}%",
            "risk_profile": request.risk_tolerance,
            "portfolio_type": "balanced",
            "rbc_analysis": {
                "portfolio_id": portfolio_id or "demo-portfolio",
                "portfolio_type": "balanced",
                "rbc_portfolio_type": "balanced",
                "total_investment": total_contributions,
                "rbc_current_value": total_contributions,
                "risk_tolerance": request.risk_tolerance,
                "expected_return": f"{expected_annual_return*100:.1f}%",
                "note": "Fast RBC API integration"
            },
            "rbc_api_used": rbc_success,
            "data_source": "RBC InvestEase API" if rbc_success else "Calculated estimates",
            "recommendations": [
                f"With ${monthly_savings:,.0f}/month savings over 5 years, you'll contribute ${total_contributions:,.0f}",
                f"Based on your {request.risk_tolerance.replace('-', ' ')} risk tolerance ({expected_annual_return*100:.1f}% expected return)",
                f"Your investments could grow to ${projected_value_5_years:,.0f}",
                f"That's ${investment_growth:,.0f} in investment growth beyond your contributions"
            ]
        }
        
        print(f"🎯 Total analysis time: {time.time() - start_time:.2f}s")
        return response
        
    except Exception as e:
        print(f"❌ Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/v1/house-search")
async def search_houses(request: HouseSearchRequest):
    """Fast house search using Zillow API"""
    try:
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
        from zillowScraper import ZillowAPI
        
        # Get API key from environment
        zillow_api_key = os.getenv("ZILLOW_API_KEY")
        if not zillow_api_key:
            raise HTTPException(status_code=500, detail="Zillow API key not configured")
        
        # Initialize Zillow API
        zillow = ZillowAPI(api_key=zillow_api_key)
        
        # Search for houses
        houses = zillow.search_homes(
            location=request.location,
            downpayment=request.downpayment,
            leverage=request.leverage
        )
        
        # Format response
        formatted_houses = []
        for house in houses:
            price = house.get("price", 0)
            monthly_payment = calculate_monthly_mortgage_payment(price, request.downpayment)
            
            formatted_house = {
                "address": house.get("address", ""),
                "price": price,
                "downpayment_needed": request.downpayment,
                "monthly_payment": monthly_payment,
                "living_area": house.get("livingArea", 0),
                "bedrooms": house.get("bedrooms", 0),
                "bathrooms": house.get("bathrooms", 0),
                "image_url": house.get("imgSrc") or "",
                "zillow_url": house.get("detailUrl", ""),
                "affordability_analysis": {
                    "downpayment_coverage": f"{(request.downpayment / price * 100):.1f}%" if price > 0 else "0%",
                    "loan_amount": price - request.downpayment,
                    "estimated_monthly_payment": monthly_payment
                }
            }
            formatted_houses.append(formatted_house)
        
        return {
            "houses": formatted_houses,
            "search_criteria": {
                "location": request.location,
                "downpayment": request.downpayment,
                "leverage": request.leverage
            },
            "total_found": len(formatted_houses)
        }
        
    except Exception as e:
        print(f"House search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"House search failed: {str(e)}")

def calculate_monthly_mortgage_payment(price: float, downpayment: float, interest_rate: float = 0.065, years: int = 30):
    """Calculate estimated monthly mortgage payment"""
    loan_amount = price - downpayment
    if loan_amount <= 0:
        return 0
    
    monthly_rate = interest_rate / 12
    num_payments = years * 12
    
    if monthly_rate == 0:
        return loan_amount / num_payments
    
    monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** num_payments) / ((1 + monthly_rate) ** num_payments - 1)
    return round(monthly_payment, 2)

@app.get("/api/v1/dashboard")
def get_dashboard():
    """Simple dashboard endpoint"""
    try:
        if SQLITE_AVAILABLE:
            from sqlite_db import get_dashboard_data
            return get_dashboard_data()
        else:
            return {"total_spent": 1500, "total_transactions": 25, "avg_transaction": 60}
    except Exception as e:
        print(f"Dashboard error: {e}")
        return {"total_spent": 1500, "total_transactions": 25, "avg_transaction": 60}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting optimized FastAPI server...")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)  # Disable reload for stability
