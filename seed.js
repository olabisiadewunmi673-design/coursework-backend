const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "coursework";
const client = new MongoClient(uri);

const sampleLessons = [
  { subject: "Mathematics", location: "Hendon", price: 100, spaces: 5, image: "mathematics.jpg", icon: "fa-calculator" },
  { subject: "English Literature", location: "Colindale", price: 85, spaces: 6, image: "english-literature.jpg", icon: "fa-book-open" },
  { subject: "Chemistry", location: "Brent Cross", price: 110, spaces: 7, image: "chemistry.jpg", icon: "fa-flask" },
  { subject: "Physics", location: "Golders Green", price: 105, spaces: 8, image: "physics.jpg", icon: "fa-atom" },
  { subject: "World History", location: "Hendon", price: 75, spaces: 5, image: "history.jpg", icon: "fa-landmark" },
  { subject: "Geography", location: "Colindale", price: 80, spaces: 6, image: "geography.jpg", icon: "fa-globe" },
  { subject: "Computer Science", location: "Brent Cross", price: 120, spaces: 9, image: "computer-science.jpg", icon: "fa-laptop-code" },
  { subject: "Biology", location: "Golders Green", price: 95, spaces: 7, image: "biology.jpg", icon: "fa-dna" },
  { subject: "Art & Design", location: "Hendon", price: 70, spaces: 5, image: "art-design.jpg", icon: "fa-palette" },
  { subject: "Music Theory", location: "Colindale", price: 80, spaces: 6, image: "music-theory.jpg", icon: "fa-music" },
  { subject: "Economics", location: "Brent Cross", price: 90, spaces: 8, image: "economics.jpg", icon: "fa-chart-line" },
  { subject: "Psychology", location: "Golders Green", price: 85, spaces: 7, image: "psychology.jpg", icon: "fa-brain" }
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
