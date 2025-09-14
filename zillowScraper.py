import requests

def get_zillow_data(zip_code: str):
    url = f"https://www.zillow.com/api/v3/search/results/list/{zip_code}/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    return response.json()

print(get_zillow_data("10001"))