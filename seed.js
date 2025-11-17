const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "coursework";
const client = new MongoClient(uri);

const sampleLessons = [
  { topic: "Math", location: "Hendon", price: 100, space: 5, image: "math.jpg" },
  { topic: "Math", location: "Colindale", price: 80, space: 2, image: "math.jpg" },
  { topic: "Math", location: "Brent Cross", price: 90, space: 6, image: "math.jpg" },
  { topic: "Math", location: "Golders Green", price: 95, space: 7, image: "math.jpg" },
  { topic: "English", location: "Hendon", price: 85, space: 3, image: "english.jpg" },
  { topic: "English", location: "Colindale", price: 75, space: 4, image: "english.jpg" },
  { topic: "Science", location: "Brent Cross", price: 110, space: 8, image: "science.jpg" },
  { topic: "Science", location: "Golders Green", price: 105, space: 2, image: "science.jpg" },
  { topic: "History", location: "Hendon", price: 70, space: 5, image: "history.jpg" },
  { topic: "History", location: "Colindale", price: 65, space: 3, image: "history.jpg" },
  { topic: "Geography", location: "Brent Cross", price: 80, space: 6, image: "geography.jpg" },
  { topic: "Geography", location: "Golders Green", price: 85, space: 4, image: "geography.jpg" }
];

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Clear existing data
    await db.collection("lessons").deleteMany({});
    await db.collection("orders").deleteMany({});
    
    // Insert sample lessons
    await db.collection("lessons").insertMany(sampleLessons);
    
    console.log("Database seeded successfully!");
    console.log(`Inserted ${sampleLessons.length} lessons`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
