# CST3144 Coursework Backend

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure MongoDB is running on your machine or update the MONGODB_URI in .env

3. Seed the database with sample lessons:
   ```bash
   node seed.js
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Routes

### GET /lessons
Returns all lessons as JSON

### POST /orders
Creates a new order
Body: { name, phoneNumber, lessonIds, numberOfSpaces, totalAmount }

### PUT /lessons/:id
Updates any lesson field
Body: { topic, location, price, space, etc. }

### GET /search?query=<search_term>
Searches lessons by topic, location, price, or space

### Static Files
Lesson images served at /images/<filename>

## Middleware

- Logger: Logs all requests to console
- Static file: Serves images from /images directory
