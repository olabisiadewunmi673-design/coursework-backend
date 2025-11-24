#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont
import json

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

# Subject configurations with colors and icons
subjects = {
    'mathematics.jpg': {
        'color': '#2E86AB',  # Blue
        'icon': '∑∫π',
        'description': 'Mathematics symbols and formulas',
        'license': 'Created Placeholder'
    },
    'english-literature.jpg': {
        'color': '#A23B72',  # Purple
        'icon': '📚',
        'description': 'English Literature books and writing',
        'license': 'Created Placeholder'
    },
    'chemistry.jpg': {
        'color': '#F18F01',  # Orange
        'icon': '⚗️',
        'description': 'Chemistry laboratory equipment',
        'license': 'Created Placeholder'
    },
    'physics.jpg': {
        'color': '#C73E1D',  # Red
        'icon': '⚛️',
        'description': 'Physics symbols and equations',
        'license': 'Created Placeholder'
    },
    'computer-science.jpg': {
        'color': '#4A90E2',  # Light Blue
        'icon': '</>',
        'description': 'Computer programming and code',
        'license': 'Created Placeholder'
    },
    'biology.jpg': {
        'color': '#7FB069',  # Green
        'icon': '🧬',
        'description': 'Biology and life sciences',
        'license': 'Created Placeholder'
    },
    'art-design.jpg': {
        'color': '#E85D75',  # Pink
        'icon': '🎨',
        'description': 'Art and creative design',
        'license': 'Created Placeholder'
    },
    'music-theory.jpg': {
        'color': '#8B5CF6',  # Violet
        'icon': '♪♫',
        'description': 'Music theory and notation',
        'license': 'Created Placeholder'
    },
    'economics.jpg': {
        'color': '#10B981',  # Emerald
        'icon': '📈',
        'description': 'Economics and finance',
        'license': 'Created Placeholder'
    },
    'psychology.jpg': {
        'color': '#F59E0B',  # Amber
        'icon': '🧠',
        'description': 'Psychology and mind studies',
        'license': 'Created Placeholder'
    },
    'history.jpg': {
        'color': '#8B4513',  # Brown
        'icon': '🏛️',
        'description': 'World History and historical events',
        'license': 'Created Placeholder'
    },
    'geography.jpg': {
        'color': '#006400',  # Dark Green
        'icon': '🗺️',
        'description': 'Geography and world maps',
        'license': 'Created Placeholder'
    }
}

def create_lesson_card_image(filename, data):
    try:
        # Create image with lesson card dimensions (400x300)
        width, height = 400, 300
        img = Image.new('RGB', (width, height), data['color'])
        draw = ImageDraw.Draw(img)
        
        # Draw a subtle border
        border_color = '#FFFFFF'
        draw.rectangle([10, 10, width-10, height-10], outline=border_color, width=3)
        
        # Draw inner border
        draw.rectangle([20, 20, width-20, height-20], outline=border_color, width=1)
        
        # Add icon/text in the center
        try:
            # Try to use a larger font
            font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 60)
        except:
            # Fallback to default font
            font = ImageFont.load_default()
        
        # Get text size for centering
        bbox = draw.textbbox((0, 0), data['icon'], font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center the icon
        x = (width - text_width) // 2
        y = (height - text_height) // 2 - 20
        
        # Draw icon with shadow effect
        shadow_offset = 2
        draw.text((x + shadow_offset, y + shadow_offset), data['icon'], fill='#000000', font=font)
        draw.text((x, y), data['icon'], fill='#FFFFFF', font=font)
        
        # Add subject name at bottom
        subject_name = filename.replace('.jpg', '').replace('-', ' ').title()
        try:
            font_small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 24)
        except:
            font_small = ImageFont.load_default()
        
        bbox_small = draw.textbbox((0, 0), subject_name, font=font_small)
        text_width_small = bbox_small[2] - bbox_small[0]
        x_small = (width - text_width_small) // 2
        y_small = height - 50
        
        # Draw subject name with shadow
        draw.text((x_small + 1, y_small + 1), subject_name, fill='#000000', font=font_small)
        draw.text((x_small, y_small), subject_name, fill='#FFFFFF', font=font_small)
        
        # Save the image
        img_path = f'images/{filename}'
        img.save(img_path, 'JPEG', quality=90, optimize=True)
        
        # Get file size
        file_size = os.path.getsize(img_path) / 1024  # KB
        
        print(f"✓ Created {filename} ({file_size:.1f} KB)")
        
        return {
            'source': 'Generated placeholder image',
            'license': data['license'],
            'description': data['description'],
            'size_kb': round(file_size, 1)
        }
        
    except Exception as e:
        print(f"✗ Failed to create {filename}: {e}")
        return None

# Create all images
sources_data = {}

for filename, data in subjects.items():
    result = create_lesson_card_image(filename, data)
    if result:
        sources_data[filename] = result

# Save sources.json
with open('images/sources.json', 'w') as f:
    json.dump(sources_data, f, indent=2)

print(f"\n✓ Created {len(sources_data)} lesson card images successfully")
print("✓ Sources saved to images/sources.json")
