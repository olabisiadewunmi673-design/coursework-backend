#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create images directory if it doesn't exist
const imagesDir = 'images';
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Subject configurations with colors and icons
const subjects = {
    'mathematics.jpg': {
        color: '#2E86AB',  // Blue
        icon: '∑∫π',
        description: 'Mathematics symbols and formulas',
        license: 'Created Placeholder'
    },
    'english-literature.jpg': {
        color: '#A23B72',  // Purple
        icon: '📚',
        description: 'English Literature books and writing',
        license: 'Created Placeholder'
    },
    'chemistry.jpg': {
        color: '#F18F01',  // Orange
        icon: '⚗️',
        description: 'Chemistry laboratory equipment',
        license: 'Created Placeholder'
    },
    'physics.jpg': {
        color: '#C73E1D',  // Red
        icon: '⚛️',
        description: 'Physics symbols and equations',
        license: 'Created Placeholder'
    },
    'computer-science.jpg': {
        color: '#4A90E2',  // Light Blue
        icon: '</>',
        description: 'Computer programming and code',
        license: 'Created Placeholder'
    },
    'biology.jpg': {
        color: '#7FB069',  // Green
        icon: '🧬',
        description: 'Biology and life sciences',
        license: 'Created Placeholder'
    },
    'art-design.jpg': {
        color: '#E85D75',  // Pink
        icon: '🎨',
        description: 'Art and creative design',
        license: 'Created Placeholder'
    },
    'music-theory.png': {
        color: '#8B5CF6',  // Violet
        icon: '♪♫',
        description: 'Music theory and notation',
        license: 'Created Placeholder'
    },
    'economics.jpg': {
        color: '#10B981',  // Emerald
        icon: '📈',
        description: 'Economics and finance',
        license: 'Created Placeholder'
    },
    'psychology.jpg': {
        color: '#F59E0B',  // Amber
        icon: '🧠',
        description: 'Psychology and mind studies',
        license: 'Created Placeholder'
    },
    'history.jpg': {
        color: '#8B4513',  // Brown
        icon: '🏛️',
        description: 'World History and historical events',
        license: 'Created Placeholder'
    },
    'geography.jpg': {
        color: '#006400',  // Dark Green
        icon: '🗺️',
        description: 'Geography and world maps',
        license: 'Created Placeholder'
    }
};

async function createLessonCardImage(filename, data) {
    try {
        // Create image with lesson card dimensions (400x300)
        const width = 400;
        const height = 300;
        
        // Create a simple colored rectangle with text overlay
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${data.color}"/>
                <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="none" stroke="white" stroke-width="3"/>
                <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="none" stroke="white" stroke-width="1"/>
                <text x="${width/2}" y="${height/2 - 20}" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">${data.icon}</text>
                <text x="${width/2}" y="${height - 30}" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif">${filename.replace(/\.[^/.]+$/, "").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</text>
            </svg>
        `;
        
        const imgBuffer = Buffer.from(svg);
        
        // Convert to appropriate format
        const outputPath = path.join(imagesDir, filename);
        await sharp(imgBuffer)
            .toFile(outputPath);
        
        // Get file size
        const stats = fs.statSync(outputPath);
        const fileSizeKB = stats.size / 1024;
        
        console.log(`✓ Created ${filename} (${fileSizeKB.toFixed(1)} KB)`);
        
        return {
            source: 'Generated placeholder image',
            license: data.license,
            description: data.description,
            size_kb: Math.round(fileSizeKB * 10) / 10
        };
        
    } catch (error) {
        console.log(`✗ Failed to create ${filename}: ${error.message}`);
        return null;
    }
}

async function createAllImages() {
    const sourcesData = {};
    
    for (const [filename, data] of Object.entries(subjects)) {
        const result = await createLessonCardImage(filename, data);
        if (result) {
            sourcesData[filename] = result;
        }
    }
    
    // Save sources.json
    const sourcesPath = path.join(imagesDir, 'sources.json');
    fs.writeFileSync(sourcesPath, JSON.stringify(sourcesData, null, 2));
    
    console.log(`\n✓ Created ${Object.keys(sourcesData).length} lesson card images successfully`);
    console.log('✓ Sources saved to images/sources.json');
}

createAllImages().catch(console.error);
