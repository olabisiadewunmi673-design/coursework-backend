#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

// Create images directory if it doesn't exist
const imagesDir = 'images';
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Subject images with Wikimedia Commons URLs optimized for lesson cards
const subjects = {
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
    'music-theory.png': {
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
};

async function downloadAndResizeImage(filename, data) {
    try {
        // Extract the actual filename from the URL
        const fileName = data.url.split('/').pop().replace(/:/g, '_');
        
        // Use the correct Wikimedia Commons download URL format
        const downloadUrl = `https://upload.wikimedia.org/wikipedia/commons/${fileName}`;
        
        console.log(`Downloading ${filename} from ${downloadUrl}`);
        
        // Add headers to mimic a browser request
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };
        
        const response = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: headers
        });
        
        // Process image with sharp
        const imgBuffer = Buffer.from(response.data);
        
        // Resize to maintain aspect ratio while fitting lesson card dimensions
        const maxWidth = 400;
        const maxHeight = 300;
        
        const outputPath = path.join(imagesDir, filename);
        await sharp(imgBuffer)
            .resize(maxWidth, maxHeight, { 
                fit: 'inside',
                withoutEnlargement: true 
            })
            .jpeg({ quality: 85, progressive: true })
            .toFile(outputPath);
        
        // Get file size
        const stats = fs.statSync(outputPath);
        const fileSizeKB = stats.size / 1024;
        
        console.log(`✓ Downloaded and resized ${filename} (${fileSizeKB.toFixed(1)} KB)`);
        
        return {
            source: data.url,
            license: data.license,
            description: data.description,
            size_kb: Math.round(fileSizeKB * 10) / 10
        };
        
    } catch (error) {
        console.log(`✗ Failed to download ${filename}: ${error.message}`);
        return null;
    }
}

async function downloadAllImages() {
    const sourcesData = {};
    
    for (const [filename, data] of Object.entries(subjects)) {
        const result = await downloadAndResizeImage(filename, data);
        if (result) {
            sourcesData[filename] = result;
        }
    }
    
    // Save sources.json
    const sourcesPath = path.join(imagesDir, 'sources.json');
    fs.writeFileSync(sourcesPath, JSON.stringify(sourcesData, null, 2));
    
    console.log(`\n✓ Downloaded ${Object.keys(sourcesData).length} images successfully`);
    console.log('✓ Sources saved to images/sources.json');
}

downloadAllImages().catch(console.error);
