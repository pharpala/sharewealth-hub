import requests

class ZillowAPI:
    def __init__(self, api_key: str):
        self.base_url = "https://zillow-com1.p.rapidapi.com"
        self.headers = {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": "zillow-com1.p.rapidapi.com"
        }

    def search_homes(self, location: str, min_price: int = None, max_price: int = None, status_type: str = "ForSale"):
        """
        Search for homes by location and price range.
        
        :param location: City, State or Zip (e.g., "Austin, TX" or "90210")
        :param min_price: Minimum listing price
        :param max_price: Maximum listing price
        :param status_type: "ForSale", "ForRent", etc.
        :return: JSON response of matching homes
        """
        url = f"{self.base_url}/propertyExtendedSearch"
        params = {"location": location, "status_type": status_type}

        if min_price:
            params["price_min"] = min_price
        if max_price:
            params["price_max"] = max_price

        resp = requests.get(url, headers=self.headers, params=params)
        resp.raise_for_status()
        return resp.json()

if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.getenv("ZILLOW_API_KEY")
    zillow = ZillowAPI(api_key=api_key)
    print(zillow.search_homes("Waterloo, ON", min_price=100000, max_price=200000))