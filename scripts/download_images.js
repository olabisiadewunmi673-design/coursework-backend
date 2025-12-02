#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

// Mapping of subjects to Wikimedia Commons images (verified URLs)
const IMAGE_SOURCES = {
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
};

async function downloadImages() {
    const imagesDir = "images";
    
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    const sourcesInfo = {};
    
    for (const [filename, info] of Object.entries(IMAGE_SOURCES)) {
        const filepath = path.join(imagesDir, filename);
        console.log(`Downloading ${filename}...`);
        
        try {
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Educational Project) Bot/1.0'
            };
            
            const response = await axios({
                method: 'get',
                url: info.url,
                responseType: 'stream',
                headers: headers,
                timeout: 30000
            });
            
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            
            // Check file size
            const stats = fs.statSync(filepath);
            const fileSizeKB = stats.size / 1024;
            console.log(`  ✓ Downloaded ${filename} (${fileSizeKB.toFixed(1)} KB)`);
            
            // Store source information
            sourcesInfo[filename] = {
                source: info.source,
                license: info.license,
                description: info.description,
                size_kb: Math.round(fileSizeKB * 10) / 10
            };
            
            // Be polite to the server
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.log(`  ✗ Error downloading ${filename}: ${error.message}`);
        }
    }
    
    // Save sources.json
    const sourcesPath = path.join(imagesDir, "sources.json");
    fs.writeFileSync(sourcesPath, JSON.stringify(sourcesInfo, null, 2));
    
    console.log(`\n✓ Images downloaded to ${imagesDir}/`);
    console.log(`✓ Source information saved to ${sourcesPath}`);
}

downloadImages().catch(console.error);
