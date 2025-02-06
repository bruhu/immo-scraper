import requests
from bs4 import BeautifulSoup
import json
import re  # Regular expressions for extracting details

# URL to scrape
URL = "https://www.immowelt.de/liste/muenchen/wohnungen/mieten"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# Function to parse and break down the details
def parse_details(details):
    # Default values in case no details are found
    rooms = "Nicht angegeben"
    area = "Nicht angegeben"
    floor = "Nicht angegeben"
    availability = "Nicht angegeben"

    # Regular expressions to extract rooms, area, floor, and availability date
    rooms_match = re.search(r"(\d+)\s?Zimmer", details)  # Extract rooms (Zimmer)
    area_match = re.search(r"(\d+[\.,]?\d*)\s?m²", details)  # Extract square meters (m²)
    floor_match = re.search(r"(EG|1\.[\d]+|2\.[\d]+|[\d]+\.?\s?Geschoss|Stockwerk)", details)  # Extract floor information
    availability_match = re.search(r"frei ab (\d{2}\.\d{2}\.\d{4})", details)  # Extract availability date (frei ab dd.mm.yyyy)

    # Set extracted values if found
    if rooms_match:
        rooms = rooms_match.group(1)
    if area_match:
        area = area_match.group(1)
    
    # Check if availability exists, and set it, otherwise treat as floor
    if availability_match:
        availability = availability_match.group(1)  # Extract the date
    else:
        # If no availability found, attempt to extract the floor, considering floor-related patterns
        if floor_match:
            floor = floor_match.group(1)

    return rooms, area, floor, availability

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
        agency = item.select_one(".css-ypaw2y").text.strip() if item.select_one(".css-ypaw2y") else ""

        # Parse the details string to extract rooms, area, floor, and availability
        rooms, area, floor, availability = parse_details(details)

        # Append the listing info with the parsed details
        listings.append({
            "title": title,
            "price": price,
            "location": location,
            "details": details,  # Original details field (text)
            "rooms": rooms,      # Parsed rooms
            "sqm": area,         # Parsed square meters
            "floor": floor,      # Parsed floor
            "availability": availability,  # New field for availability date
            "image": image,
            "agency": agency
        })

    return listings

# Save data as JSON
data = scrape_immo()
with open("immo-scraper/data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Scraping ist fertig! Daten in data.json gespeichert")
