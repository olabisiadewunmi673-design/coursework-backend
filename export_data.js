const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "coursework";
const client = new MongoClient(uri);
const fs = require("fs");
const path = require("path");

async function exportData() {
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Export lessons
    const lessons = await db.collection("lessons").find({}).toArray();
    const lessonsPath = path.join(__dirname, "data", "exports", "lessons.json");
    fs.writeFileSync(lessonsPath, JSON.stringify(lessons, null, 2));
    console.log(`✓ Exported ${lessons.length} lessons to ${lessonsPath}`);
    
    // Export orders
    const orders = await db.collection("orders").find({}).toArray();
    const ordersPath = path.join(__dirname, "data", "exports", "orders.json");
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
    console.log(`✓ Exported ${orders.length} orders to ${ordersPath}`);
    
  } catch (error) {
    console.error("Export failed:", error);
  } finally {
    await client.close();
  }
}

exportData();
