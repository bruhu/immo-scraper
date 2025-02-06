import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime, date

# URL to scrape
URL = "https://www.immowelt.de/liste/muenchen/wohnungen/mieten"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# parse and break down listing details
def parse_listing_details(listing_details):
    rooms = "Nicht angegeben"
    area = "Nicht angegeben"
    floor_level = "Nicht angegeben"
    available_from = "Nicht angegeben"

    # extract rooms, area, floor_level, and available_from date
    rooms_match = re.search(r"(\d+)\s?Zimmer", listing_details)
    area_match = re.search(r"(\d+[\.,]?\d*)\s?m²", listing_details)
    floor_level_match = re.search(r"(EG|1\.[\d]+|2\.[\d]+|[\d]+\.?\s?Geschoss|Stockwerk)", listing_details)
    available_from_match = re.search(r"frei ab (\d{2}\.\d{2}\.\d{4})", listing_details)

    # set extracted values if found
    if rooms_match:
        rooms = rooms_match.group(1)
    if area_match:
        area = area_match.group(1)
    
    # check if available_from exists, and set it, otherwise treat as floor_level
    if available_from_match:
        available_from = available_from_match.group(1)
    else:
        # If no available_from found, attempt to extract the floor_level, considering floor_level-related patterns
        if floor_level_match:
            floor_level = floor_level_match.group(1)

    return rooms, area, floor_level, available_from

# extract rent from the monthly_rent string
def extract_rent(monthly_rent):
    # remove non-numeric chars, convert to int
    rent = re.sub(r"[^\d]", "", monthly_rent)
    return int(rent) if rent else 0

# parse and convert available_from to datetime
def parse_available_from(available_from):
    if available_from != "Nicht angegeben":
        # Convert date string to datetime object (DD.MM.YYYY format)
        return datetime.strptime(available_from, "%d.%m.%Y").date()
    return available_from  # If not available, return "Nicht angegeben"

# serialize datetime.date objects as strings
from datetime import datetime, date  # Import date explicitly

# serialize datetime.date objects as strings
def date_converter(obj):
    if isinstance(obj, date):  # Use the explicitly imported 'date'
        return obj.strftime("%d.%m.%Y")
    raise TypeError("Type not serializable")

# Function to parse the location into district, city, and postal code (PLZ)
def parse_location(location):
    # Try matching with the full format that includes the street address, district, city, and postal code
    match = re.match(r"([A-Za-zÄÖÜäöüß\s\-]+(?:\s*\d+)?),\s*([^,]+),\s*(\w+)\s*\((\d{5})\)", location)
    
    # If the full format matches, extract the street, district, city, and postal code
    if match:
        street_and_number = match.group(1)  # Can be something like "Rosa-Kempf-Straße 11"
        district = match.group(2)  # "Freiham" or "Neuschwabing"
        city = match.group(3)  # "München"
        plz = int(match.group(4))  # Postal code as integer (e.g., 81249)

        return district, city, plz

    # If no full format match, attempt a simpler case that just extracts district and postal code
    match_simple = re.match(r"([A-Za-zÄÖÜäöüß\s\-]+),\s*(\w+)\s*\((\d{5})\)", location)
    if match_simple:
        district = match_simple.group(1)
        city = match_simple.group(2)
        plz = int(match_simple.group(3))  # Postal code as integer (e.g., 81375)
        return district, city, plz
    
    # If the format is still not matched, check just for the presence of parentheses and extract the postal code
    plz_match = re.search(r"\((\d{5})\)", location)
    if plz_match:
        # Extract PLZ from parentheses
        plz = int(plz_match.group(1))
        return "Nicht angegeben", "München", plz

    # If no postal code is found, return defaults
    return "Nicht angegeben", "München", None



# scrape data
def scrape_immo():
    response = requests.get(URL, headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")

    listings = []
    for item in soup.select(".css-79elbk"):
        listing_title = item.select_one(".css-1cbj9xw").text.strip() if item.select_one(".css-1cbj9xw") else "Kein Titel vorhanden"
        monthly_rent = item.select_one(".css-1luyivc").text.strip() if item.select_one(".css-1luyivc") else "Kein Preis vorhanden"
        location = item.select_one(".css-4udngo").text.strip() if item.select_one(".css-4udngo") else "Kein Standort vorhanden"
        listing_details = item.select_one(".css-a5vdp8").text.strip() if item.select_one(".css-a5vdp8") else "Keine listing_details vorhanden"
        image_element = item.select_one(".css-1is1d0o img")  # select <img> inside div
        image = image_element['src'] if image_element and image_element.has_attr('src') else "Keine Fotos vorhanden"
        agency = item.select_one(".css-ypaw2y").text.strip() if item.select_one(".css-ypaw2y") else "Nicht angegeben"

        # Parse the listing_details string to extract rooms, area, floor_level, and available_from
        rooms, area, floor_level, available_from = parse_listing_details(listing_details)

        # Extract rent from the monthly_rent string
        rent = extract_rent(monthly_rent)

        # Convert rooms and area to floats
        rooms = float(rooms) if rooms != "Nicht angegeben" else 0.0
        area = float(area.replace(",", ".")) if area != "Nicht angegeben" else 0.0

        # Parse available_from to datetime if it exists
        available_from = parse_available_from(available_from)

        # Parse location into district, city, and PLZ
        district, city, plz = parse_location(location)

        # Calculate sqm_price
        sqm_price = round(rent / area, 2) if area > 0 else 0.0

        # Append the listing info with the parsed details
        listings.append({
            "listing_title": listing_title,
            "monthly_rent": rent,
            "location": location,
            "district": district,
            "city": city,
            "plz": plz,
            "listing_details": listing_details,
            "rooms": rooms,
            "sqm": round(area, 2),  # Round sqm to 2 decimals
            "floor_level": floor_level,
            "available_from": available_from,
            "sqm_price": sqm_price,
            "image": image,
            "agency": agency
        })

    return listings

# Save data as JSON
data = scrape_immo()
with open("immo-scraper/data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4, default=date_converter)

print("Scraping ist fertig! Daten in data.json gespeichert")
