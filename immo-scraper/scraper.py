import requests
from bs4 import BeautifulSoup
import json

# URL to scrape
URL = "https://www.immowelt.de/liste/muenchen/wohnungen/mieten"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# scrape data
def scrape_immo():
    response = requests.get(URL, headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")

    listings = []
    for item in soup.select(".css-79elbk"):
        title = item.select_one(".css-1cbj9xw").text.strip() if item.select_one(".css-1cbj9xw") else "Kein Titel vorhanden"
        price = item.select_one(".css-1luyivc").text.strip() if item.select_one(".css-1luyivc") else "Kein Preis vorhanden"
        location = item.select_one(".css-4udngo").text.strip() if item.select_one(".css-4udngo") else "Kein Standort vorhanden"
        details = item.select_one(".css-a5vdp8").text.strip() if item.select_one(".css-a5vdp8") else "Keine Details vorhanden"
        image_element = item.select_one(".css-1is1d0o img")  # select <img> inside div
        image = image_element['src'] if image_element and image_element.has_attr('src') else "Keine Fotos vorhanden"

        # append listing info
        listings.append({
            "title": title,
            "price": price,
            "location": location,
            "details": details,
            "image": image
        })

    return listings

# save data as JSON
data = scrape_immo()
with open("immo-scraper/data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Scraping ist fertig! Daten in data.json gespeichert")
