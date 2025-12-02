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
  // Security: prevent directory traversal attacks
  const requestedPath = req.path.replace(/\.\./g, "").replace(/\\/g, "/");
  const imagePath = path.join(__dirname, "images", requestedPath);
  
  // Ensure the path is still within the images directory
  if (!imagePath.startsWith(path.join(__dirname, "images"))) {
    return res.status(403).json({ error: "Access denied" });
  }
  
  // Check if file exists
  if (!require("fs").existsSync(imagePath)) {
    return res.status(404).json({ error: "Image not found" });
  }
  
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(`Error serving image ${imagePath}:`, err);
      res.status(500).json({ error: "Failed to serve image" });
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

// GET /lessons/:id - Get single lesson
app.get("/lessons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await db.collection("lessons").findOne({ _id: new ObjectId(id) });
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

// POST /orders - Save a new order
app.post("/orders", async (req, res) => {
  try {
    const order = {
      name: req.body.name,
      phone: req.body.phone,
      lessonIDs: req.body.lessonIDs || req.body.lessonIds,
      numSpaces: req.body.numSpaces || req.body.numberOfSpaces,
      timestamp: new Date()
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
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    const searchRegex = new RegExp(q, "i");
    const lessons = await db.collection("lessons").find({
      $or: [
        { subject: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { $expr: { $regexMatch: { input: { $toString: "$price" }, regex: q, options: "i" } } },
        { $expr: { $regexMatch: { input: { $toString: "$spaces" }, regex: q, options: "i" } } }
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
