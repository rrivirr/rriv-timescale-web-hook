import "dotenv/config";
import express from "express";
import { insert } from "./insert.ts";
import { Mqtt } from "./mqtt.ts";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mqtt = new Mqtt();

const startServer = async () => {
  try {
    await mqtt.connect();
  } catch (error) {
    console.log("MQTT CONNECTION FAILED");
    console.log(error);
  }

  // Start the server
  app.listen(process.env.NODE_PORT || 3006, () => {
    console.log("running...");
  });
};

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Hi from RRIV!");
});

app.post("/rriv-web-hook", async (req, res) => {
  await insert(req.body, mqtt);
  res.send("ok");
});

startServer();
