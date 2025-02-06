import requests
from bs4 import BeautifulSoup
import json

# URL of the website to scrape (Example: Immowelt)
URL = "https://www.immowelt.de/liste/muenchen/wohnungen/mieten"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# Function to scrape data
def scrape_immo():
    response = requests.get(URL, headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")

    listings = []
    for item in soup.select(".css-79elbk"):  # Adjust this selector based on website structure
        title = item.select_one(".css-1cbj9xw").text.strip() if item.select_one(".css-1cbj9xw") else "No Title"
        price = item.select_one(".css-1luyivc").text.strip() if item.select_one(".css-1luyivc") else "No Price"
        location = item.select_one(".css-4udngo").text.strip() if item.select_one(".css-4udngo") else "No Location"

        listings.append({"title": title, "price": price, "location": location})

    return listings

# Save data as JSON
data = scrape_immo()
with open("../immo-scraper/data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Scraping complete! Data saved in data.json")
