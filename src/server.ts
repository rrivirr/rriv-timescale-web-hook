import "dotenv/config";
import express from "express";
import { insert } from "./insert.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Hi from RRIV!");
});

app.post("/rriv-web-hook", async (req, res) => {
  await insert(req.body);
  res.send("ok");
});

// Start the server
app.listen(process.env.NODE_PORT || 3006, () => {
  console.log("running...");
});
