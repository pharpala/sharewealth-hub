import requests
from typing import Any, Dict, Optional

class InvestEasyAPI:
    BASE_URL = "https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev"

    def __init__(self, token: Optional[str] = None, timeout: int = 10):
        self.session = requests.Session()
        self.token = token
        self.timeout = timeout

    # --------------------------
    # Internal request handler
    # --------------------------
    def _request(self, method: str, path: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.BASE_URL}{path}"
        headers = kwargs.pop("headers", {})
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        resp = self.session.request(
            method, url, headers=headers, timeout=self.timeout, **kwargs
        )
        resp.raise_for_status()
        return resp.json()

    # --------------------------
    # Authentication
    # --------------------------
    def register_team(self, team_name: str, contact_email: str) -> Dict[str, Any]:
        """
        Register your team. Returns {teamId, jwtToken, expiresAt}.
        Also automatically stores the token for subsequent calls.
        """
        payload = {"team_name": team_name, "contact_email": contact_email}
        data = self._request("POST", "/teams/register", json=payload)
        if "jwtToken" in data:
            self.token = data["jwtToken"]
        return data

    # --------------------------
    # Clients
    # --------------------------
    def create_client(self, name: str, email: str, cash: float) -> Dict[str, Any]:
        payload = {"name": name, "email": email, "cash": cash, "portfolios": []}
        return self._request("POST", "/clients", json=payload)

    def list_clients(self) -> Dict[str, Any]:
        return self._request("GET", "/clients")

    def get_client(self, client_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/clients/{client_id}")

    def update_client(self, client_id: str, name: Optional[str] = None,
                      email: Optional[str] = None) -> Dict[str, Any]:
        payload: Dict[str, Any] = {}
        if name:
            payload["name"] = name
        if email:
            payload["email"] = email
        return self._request("PUT", f"/clients/{client_id}", json=payload)

    def delete_client(self, client_id: str) -> Dict[str, Any]:
        return self._request("DELETE", f"/clients/{client_id}")

    def deposit_to_client(self, client_id: str, amount: float) -> Dict[str, Any]:
        return self._request("POST", f"/clients/{client_id}/deposit", json={"amount": amount})

    # --------------------------
    # Portfolios
    # --------------------------
    def create_portfolio(self, client_id: str, portfolio_type: str,
                         initial_amount: float) -> Dict[str, Any]:
        payload = {"type": portfolio_type, "initialAmount": initial_amount}
        return self._request("POST", f"/clients/{client_id}/portfolios", json=payload)

    def list_portfolios(self, client_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/clients/{client_id}/portfolios")

    def get_portfolio(self, portfolio_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/portfolios/{portfolio_id}")

    def transfer_to_portfolio(self, portfolio_id: str, amount: float) -> Dict[str, Any]:
        return self._request("POST", f"/portfolios/{portfolio_id}/transfer", json={"amount": amount})

    def withdraw_from_portfolio(self, portfolio_id: str, amount: float) -> Dict[str, Any]:
        return self._request("POST", f"/portfolios/{portfolio_id}/withdraw", json={"amount": amount})

    def analyze_portfolio(self, portfolio_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/portfolios/{portfolio_id}/analysis")

    # --------------------------
    # Simulations
    # --------------------------
    def simulate_client(self, client_id: str, months: int) -> Dict[str, Any]:
        payload = {"months": months}
        return self._request("POST", f"/client/{client_id}/simulate", json=payload)