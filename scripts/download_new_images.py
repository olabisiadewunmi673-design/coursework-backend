#!/usr/bin/env python3
import requests
import os
from PIL import Image
import io

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

# Subject images with Wikimedia Commons URLs optimized for lesson cards
subjects = {
    'mathematics.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Mathematics_formula.svg',
        'description': 'Mathematics symbols and formulas',
        'license': 'Public Domain'
    },
    'english-literature.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Books-aj.svg_aj_ashton_01.svg',
        'description': 'Stack of books representing literature',
        'license': 'CC BY-SA 3.0'
    },
    'chemistry.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Chemistry_lab.svg',
        'description': 'Chemistry laboratory equipment',
        'license': 'Public Domain'
    },
    'physics.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Physics.svg',
        'description': 'Physics symbols and equations',
        'license': 'Public Domain'
    },
    'computer-science.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Computer_code.svg',
        'description': 'Computer code and programming symbols',
        'license': 'Public Domain'
    },
    'biology.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Dna.svg',
        'description': 'DNA double helix structure',
        'license': 'Public Domain'
    },
    'art-design.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Palette.svg',
        'description': 'Artist palette with colors',
        'license': 'Public Domain'
    },
    'music-theory.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Musical_notes.svg',
        'description': 'Musical notes and staff',
        'license': 'Public Domain'
    },
    'economics.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Finance_chart.svg',
        'description': 'Economic chart and graph',
        'license': 'Public Domain'
    },
    'psychology.jpg': {
        'url': 'https://commons.wikimedia.org/wiki/File:Brain.svg',
        'description': 'Human brain diagram',
        'license': 'Public Domain'
    }
}

def download_and_resize_image(filename, data):
    try:
        # Extract the actual filename from the URL
        file_name = data['url'].split('/')[-1].replace(':', '_')
        
        # Use the correct Wikimedia Commons download URL format
        download_url = f"https://upload.wikimedia.org/wikipedia/commons/{file_name}"
        
        print(f"Downloading {filename} from {download_url}")
        
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(download_url, timeout=30, headers=headers)
        response.raise_for_status()
        
        # Open image and resize for lesson cards (optimal around 300x200)
        img = Image.open(io.BytesIO(response.content))
        
        # Convert to RGB if necessary (for PNG with transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize to maintain aspect ratio while fitting lesson card dimensions
        max_width, max_height = 400, 300
        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        # Save as JPEG with good quality
        img_path = f'images/{filename}'
        img.save(img_path, 'JPEG', quality=85, optimize=True)
        
        # Get file size
        file_size = os.path.getsize(img_path) / 1024  # KB
        
        print(f"✓ Downloaded and resized {filename} ({file_size:.1f} KB)")
        
        return {
            'source': data['url'],
            'license': data['license'],
            'description': data['description'],
            'size_kb': round(file_size, 1)
        }
        
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")
        return None

# Download and process all images
sources_data = {}

for filename, data in subjects.items():
    result = download_and_resize_image(filename, data)
    if result:
        sources_data[filename] = result

# Save sources.json
import json
with open('images/sources.json', 'w') as f:
    json.dump(sources_data, f, indent=2)

print(f"\n✓ Downloaded {len(sources_data)} images successfully")
print("✓ Sources saved to images/sources.json")
