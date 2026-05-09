import requests
import os
import uuid

# To use Google Maps, set this environment variable or replace here
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

def fetch_satellite_image(lat, lng, zoom=18, size="600x600"):
    """
    Fetches a satellite image from Google Static Maps or Esri World Imagery.
    Returns the binary content of the image.
    """
    if GOOGLE_MAPS_API_KEY:
        url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom={zoom}&size={size}&maptype=satellite&key={GOOGLE_MAPS_API_KEY}"
    else:
        # Fallback to Esri World Imagery (ArcGIS)
        # We need to calculate a bounding box for the static export or use a tile-to-image conversion.
        # A simpler way is to use a public static map service that wraps Esri, 
        # but since we want reliability, we'll use a standard tile URL for a single central tile or 
        # use the ArcGIS Export API.
        
        # Simple ArcGIS Export API call (requires calculating bbox)
        # For simplicity in this demo, if no Google Key, we use a high-quality satellite tile provider 
        # that doesn't require a key for small volumes, or we just use a placeholder.
        
        # Let's use a public Esri export URL
        # We'll use a rough calculation for the bbox around the point
        delta = 0.002  # Approximately 200m
        bbox = f"{lng-delta},{lat-delta},{lng+delta},{lat+delta}"
        url = f"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox={bbox}&bboxSR=4324&layers=show:0&size={size.replace('x', ',')}&format=png&f=image"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.content
        else:
            print(f"Error fetching image: {response.status_code}")
            return None
    except Exception as e:
        print(f"Exception fetching image: {e}")
        return None

def save_satellite_shots(lat, lng):
    """
    Fetches two shots (Zoom 17 and Zoom 18) and saves them.
    Returns a list of relative paths.
    """
    paths = []
    # Ensure directory exists
    os.makedirs("backend/static/images", exist_ok=True)
    
    # Shot 1: Zoom 17 (Overview)
    img1 = fetch_satellite_image(lat, lng, zoom=17)
    if img1:
        filename1 = f"captured_satellite_{uuid.uuid4().hex[:8]}_z17.png"
        with open(f"backend/static/images/{filename1}", "wb") as f:
            f.write(img1)
        paths.append(f"/static/images/{filename1}")
        
    # Shot 2: Zoom 18 (Detail)
    img2 = fetch_satellite_image(lat, lng, zoom=18)
    if img2:
        filename2 = f"captured_satellite_{uuid.uuid4().hex[:8]}_z18.png"
        with open(f"backend/static/images/{filename2}", "wb") as f:
            f.write(img2)
        paths.append(f"/static/images/{filename2}")
        
    return paths
