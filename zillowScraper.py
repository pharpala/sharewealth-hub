import requests

class ZillowAPI:
    def __init__(self, api_key: str):
        self.base_url = "https://zillow-com1.p.rapidapi.com"
        self.headers = {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": "zillow-com1.p.rapidapi.com"
        }

    def search_homes(self, location, downpayment, leverage=5):
        """
        Search homes by location and downpayment.
        Post-filters results to enforce:
          - Price in range
          - Must be in requested city
          - Must have an image
          - Top 5 by square footage
        """
        price = downpayment * leverage
        min_price = int(price * 0.9)
        max_price = int(price * 1.1)

        url = f"{self.base_url}/propertyExtendedSearch"
        params = {
            "location": location,
            "status_type": "ForSale",
            "price_min": min_price,
            "price_max": max_price
        }

        resp = requests.get(url, headers=self.headers, params=params)
        resp.raise_for_status()
        data = resp.json()

        props = data.get("props", [])

        # 🔎 Post-filter and format URLs
        filtered = []
        for home in props:
            price = home.get("price")
            address = home.get("address", "").lower()
            images = home.get("imgSrc") or home.get("hdpData", {}).get("homeInfo", {}).get("imgSrc")

            if (
                price is not None and min_price <= price <= max_price
                and location.split(",")[0].strip().lower() in address  # city must match
                and images  # must have at least one image
            ):
                # Fix the Zillow URL - API returns relative URLs, we need full URLs
                detail_url = home.get("detailUrl", "")
                if detail_url and detail_url.startswith("/"):
                    # Convert relative URL to full URL
                    home["detailUrl"] = f"https://www.zillow.com{detail_url}"
                elif not detail_url:
                    # Fallback: Generate URL if not provided
                    zpid = home.get("zpid") or home.get("id") or home.get("propertyId")
                    original_address = home.get("address", "")
                    
                    if zpid and original_address:
                        # Clean and format address for URL
                        clean_address = original_address.replace(" ", "-").replace(",", "-").replace("#", "").replace(".", "")
                        clean_address = "-".join([part for part in clean_address.split("-") if part and part.strip()])
                        clean_address = clean_address.strip("-")
                        home["detailUrl"] = f"https://www.zillow.com/homedetails/{clean_address}/{zpid}_zpid"
                
                filtered.append(home)

        # 📏 Sort by square footage (descending) & keep top 5
        filtered = sorted(filtered, key=lambda x: x.get("livingArea") or 0, reverse=True)[:3]

        return filtered

def test_url_generation():
    """Test URL generation with the example you provided"""
    # Test data based on your example
    test_house = {
        "address": "65 Westmount Rd N #311, Waterloo, ON N2L 5G6",
        "zpid": "456362867",
        "price": 309000,
        "livingArea": 1188
    }
    
    # Clean and format address for URL
    original_address = test_house["address"]
    clean_address = original_address.replace(" ", "-").replace(",", "-").replace("#", "").replace(".", "")
    clean_address = "-".join([part for part in clean_address.split("-") if part and part.strip()])
    clean_address = clean_address.strip("-")
    
    expected_url = f"https://www.zillow.com/homedetails/{clean_address}/{test_house['zpid']}_zpid"
    print(f"Test URL Generation:")
    print(f"  Original Address: {original_address}")
    print(f"  Clean Address: {clean_address}")
    print(f"  Generated URL: {expected_url}")
    print(f"  Expected Format: https://www.zillow.com/homedetails/65-Westmount-Rd-N-311-Waterloo-ON-N2L-5G6/456362867_zpid")
    
    return expected_url

if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.getenv("ZILLOW_API_KEY")
    
    if api_key:
        zillow = ZillowAPI(api_key=api_key)
        results = zillow.search_homes("Waterloo, ON", 250000)
        print("Sample results:")
        for i, house in enumerate(results[:2]):  # Show first 2 results
            print(f"\nHouse {i+1}:")
            print(f"  Address: {house.get('address')}")
            print(f"  Price: ${house.get('price'):,}")
            print(f"  Zillow URL: {house.get('detailUrl')}")
            print(f"  Living Area: {house.get('livingArea')} sqft")
    else:
        print("No ZILLOW_API_KEY found - skipping live API test")