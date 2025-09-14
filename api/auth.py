import os
import requests
from jose import jwt
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Load Auth0 settings from environment variables
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
ALGORITHMS = ["RS256"]

# Security scheme for FastAPI (parses Authorization: Bearer <token>)
bearer_scheme = HTTPBearer()

def get_jwks():
    """Fetch JSON Web Key Set from Auth0"""
    url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    return requests.get(url).json()

def verify_token(token: str):
    """Verify a JWT from Auth0"""
    # Allow mock token for development
    if token == "mock-jwt-token":
        return {
            "sub": "mock-user-123",
            "email": "demo@example.com",
            "name": "Demo User"
        }
    
    # Check if Auth0 is configured
    if not AUTH0_DOMAIN or not API_AUDIENCE:
        # For development, allow any token and return mock user
        return {
            "sub": "dev-user-123",
            "email": "dev@example.com",
            "name": "Development User"
        }
    
    try:
        jwks = get_jwks()
        unverified_header = jwt.get_unverified_header(token)

        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }

        if not rsa_key:
            raise HTTPException(status_code=401, detail="Invalid token")

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def auth_required(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    """Dependency to secure FastAPI routes"""
    return verify_token(credentials.credentials)