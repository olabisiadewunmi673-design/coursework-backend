#!/usr/bin/env python3
import requests
import os
import json
import time

# Mapping of subjects to Wikimedia Commons images (verified URLs)
IMAGE_SOURCES = {
    "math.jpg": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Pi-symbol.svg/480px-Pi-symbol.svg.png",
        "source": "https://commons.wikimedia.org/wiki/File:Pi-symbol.svg",
        "license": "Public Domain",
        "description": "Mathematical Pi symbol"
    },
    "english.jpg": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Metal_movable_type.jpg/640px-Metal_movable_type.jpg",
        "source": "https://commons.wikimedia.org/wiki/File:Metal_movable_type.jpg",
        "license": "CC BY-SA 3.0",
        "description": "Metal movable type for printing"
    },
    "science.jpg": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Atom.svg/480px-Atom.svg.png",
        "source": "https://commons.wikimedia.org/wiki/File:Atom.svg",
        "license": "CC BY-SA 4.0",
        "description": "Atom symbol for science"
    },
    "history.jpg": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/640px-All_Gizah_Pyramids.jpg",
        "source": "https://commons.wikimedia.org/wiki/File:All_Gizah_Pyramids.jpg",
        "license": "CC BY-SA 2.0",
        "description": "Pyramids of Giza"
    },
    "geography.jpg": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mercator-projection.jpg/640px-Mercator-projection.jpg",
        "source": "https://commons.wikimedia.org/wiki/File:Mercator-projection.jpg",
        "license": "CC BY-SA 3.0",
        "description": "World map in Mercator projection"
    }
}

def download_images():
    """Download images from Wikimedia Commons"""
    images_dir = "images"
    
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)
    
    sources_info = {}
    
    for filename, info in IMAGE_SOURCES.items():
        filepath = os.path.join(images_dir, filename)
        print(f"Downloading {filename}...")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Educational Project) Bot/1.0'
            }
            response = requests.get(info["url"], headers=headers, stream=True)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Check file size
            file_size = os.path.getsize(filepath) / 1024  # Size in KB
            print(f"  ✓ Downloaded {filename} ({file_size:.1f} KB)")
            
            # Store source information
            sources_info[filename] = {
                "source": info["source"],
                "license": info["license"],
                "description": info["description"],
                "size_kb": round(file_size, 1)
            }
            
            time.sleep(0.5)  # Be polite to the server
            
        except Exception as e:
            print(f"  ✗ Error downloading {filename}: {e}")
    
    # Save sources.json
    sources_path = os.path.join(images_dir, "sources.json")
    with open(sources_path, 'w') as f:
        json.dump(sources_info, f, indent=2)
    
    print(f"\n✓ Images downloaded to {images_dir}/")
    print(f"✓ Source information saved to {sources_path}")

if __name__ == "__main__":
    download_images()
