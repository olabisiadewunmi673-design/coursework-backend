const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "coursework";
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB database: ${dbName}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Static file middleware for images
app.use("/images", (req, res, next) => {
  const imagePath = path.join(__dirname, "images", req.path);
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ error: "Image not found" });
    }
  });
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Coursework Backend API is running!" });
});
app.get("/health", async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "error" });
  }
});

// GET /lessons - Return all lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await db.collection("lessons").find({}).toArray();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// POST /orders - Save a new order
app.post("/orders", async (req, res) => {
  try {
    const order = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await db.collection("orders").insertOne(order);
    res.status(201).json({ ...order, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PUT /lessons/:id - Update any lesson field
app.put("/lessons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const result = await db.collection("lessons").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    
    res.json({ message: "Lesson updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

// GET /search - Full text search
app.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    const searchRegex = new RegExp(query, "i");
    const lessons = await db.collection("lessons").find({
      $or: [
        { topic: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { $expr: { $regexMatch: { input: { $toString: "$price" }, regex: query, options: "i" } } },
        { $expr: { $regexMatch: { input: { $toString: "$space" }, regex: query, options: "i" } } }
      ]
    }).toArray();
    
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Start server
async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch(console.error);
