const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "coursework";
const client = new MongoClient(uri);

const sampleLessons = [
  { subject: "Math", location: "Hendon", price: 100, spaces: 5, image: "math.jpg", icon: "fa-calculator" },
  { subject: "Math", location: "Colindale", price: 80, spaces: 5, image: "math.jpg", icon: "fa-calculator" },
  { subject: "Math", location: "Brent Cross", price: 90, spaces: 6, image: "math.jpg", icon: "fa-calculator" },
  { subject: "Math", location: "Golders Green", price: 95, spaces: 7, image: "math.jpg", icon: "fa-calculator" },
  { subject: "English", location: "Hendon", price: 85, spaces: 5, image: "english.jpg", icon: "fa-book" },
  { subject: "English", location: "Colindale", price: 75, spaces: 5, image: "english.jpg", icon: "fa-book" },
  { subject: "Science", location: "Brent Cross", price: 110, spaces: 8, image: "science.jpg", icon: "fa-flask" },
  { subject: "Science", location: "Golders Green", price: 105, spaces: 5, image: "science.jpg", icon: "fa-flask" },
  { subject: "History", location: "Hendon", price: 70, spaces: 5, image: "history.jpg", icon: "fa-landmark" },
  { subject: "History", location: "Colindale", price: 65, spaces: 5, image: "history.jpg", icon: "fa-landmark" },
  { subject: "Geography", location: "Brent Cross", price: 80, spaces: 6, image: "geography.jpg", icon: "fa-globe" },
  { subject: "Geography", location: "Golders Green", price: 85, spaces: 5, image: "geography.jpg", icon: "fa-globe" },
  { subject: "Math", location: "Online", price: 70, spaces: 10, image: "math.jpg", icon: "fa-calculator" },
  { subject: "English", location: "Online", price: 65, spaces: 8, image: "english.jpg", icon: "fa-book" },
  { subject: "Science", location: "Online", price: 95, spaces: 12, image: "science.jpg", icon: "fa-flask" },
  { subject: "History", location: "Online", price: 60, spaces: 6, image: "history.jpg", icon: "fa-landmark" },
  { subject: "Geography", location: "Online", price: 75, spaces: 9, image: "geography.jpg", icon: "fa-globe" }
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
