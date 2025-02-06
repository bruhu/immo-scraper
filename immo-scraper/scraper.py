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

    # extract rooms, area, floor, and available date
    rooms_match = re.search(r"(\d+)\s?Zimmer", listing_details)
    area_match = re.search(r"(\d+[\.,]?\d*)\s?m²", listing_details)
    floor_level_match = re.search(r"(EG|1\.[\d]+|2\.[\d]+|[\d]+\.?\s?Geschoss|Stockwerk)", listing_details)
    available_from_match = re.search(r"frei ab (\d{2}\.\d{2}\.\d{4})", listing_details)

    # set extracted values if found
    if rooms_match:
        rooms = rooms_match.group(1)
    if area_match:
        area = area_match.group(1)
    
    # check if available_from exists, else treat as floor_level
    if available_from_match:
        available_from = available_from_match.group(1)
    else:
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
        return datetime.strptime(available_from, "%d.%m.%Y").date() # convert to datetime obj
    return available_from

# serialize datetime.date objects as strings
def date_converter(obj):
    if isinstance(obj, date):
        return obj.strftime("%d.%m.%Y")
    raise TypeError("Type not serializable")

# parse location into district, city, and PLZ
def parse_location(location):
    match = re.match(r"([A-Za-zÄÖÜäöüß\s\-]+(?:\s*\d+)?),\s*([^,]+),\s*(\w+)\s*\((\d{5})\)", location)
    
    # extract street, district, city, and postal code
    if match:
        street_and_number = match.group(1)
        district = match.group(2)
        city = match.group(3)
        plz = int(match.group(4))

        return district, city, plz

    # extract district and postal code
    match_simple = re.match(r"([A-Za-zÄÖÜäöüß\s\-]+),\s*(\w+)\s*\((\d{5})\)", location)
    if match_simple:
        district = match_simple.group(1)
        city = match_simple.group(2)
        plz = int(match_simple.group(3))  # plz to int
        return district, city, plz
    
    plz_match = re.search(r"\((\d{5})\)", location)
    if plz_match:
        # extract PLZ
        plz = int(plz_match.group(1))
        return "Nicht angegeben", "München", plz

    return "Nicht angegeben", "München", None   # return defaults if there's no PLZ

# scrape data
def scrape_immo():
    response = requests.get(URL, headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")

    listings = []
    for item in soup.select(".css-79elbk"):
        listing_title = item.select_one(".css-1cbj9xw").text.strip() if item.select_one(".css-1cbj9xw") else "Kein Titel vorhanden"
        monthly_rent = item.select_one(".css-1luyivc").text.strip() if item.select_one(".css-1luyivc") else "Kein Preis vorhanden"
        location = item.select_one(".css-4udngo").text.strip() if item.select_one(".css-4udngo") else "Kein Standort vorhanden"
        listing_details = item.select_one(".css-a5vdp8").text.strip() if item.select_one(".css-a5vdp8") else "Keine Details vorhanden"
        image_element = item.select_one(".css-1is1d0o img")  # select <img> inside div
        image = image_element['src'] if image_element and image_element.has_attr('src') else "Keine Fotos vorhanden"
        agency = item.select_one(".css-ypaw2y").text.strip() if item.select_one(".css-ypaw2y") else "Nicht angegeben"

        rooms, area, floor_level, available_from = parse_listing_details(listing_details)   # parse listing_details to extract rooms, area, floor and available date

        rent = extract_rent(monthly_rent)   # extract rent

        # convert rooms and area to float
        rooms = float(rooms) if rooms != "Nicht angegeben" else 0.0
        area = float(area.replace(",", ".")) if area != "Nicht angegeben" else 0.0

        available_from = parse_available_from(available_from)   # available_from to datetime

        district, city, plz = parse_location(location)  # extract district, city and PLZ

        sqm_price = round(rent / area, 2) if area > 0 else 0.0  # calculate price per sqm

        # append data
        listings.append({
            "listing_title": listing_title,
            "monthly_rent": rent,
            "location": location,
            "district": district,
            "city": city,
            "plz": plz,
            "listing_details": listing_details,
            "rooms": rooms,
            "sqm": round(area, 2),
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
