import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT =process.env.PORT|| 3000;

// Enable CORS for React Native app
app.use(cors());
app.use(bodyParser.json());

// ESP32 and ESP32-CAM static IPs
const ESP32_IP = process.env.ESP32_IP
const ESP32_CAM_IP = process.env.ESP32_CAM_IP

// Route to send a command to ESP32
app.post("/api/esp32/command", async (req, res) => {
  const { command } = req.body; // Example: { "command": "turn_on_light" }
  try {
    const response = await axios.get(`http://${ESP32_IP}/toggle?state=${command}`);
    res.json({ status: "success", data: response.data });
  } catch (error) {
    console.error("Error communicating with ESP32:", error.message);
    res.status(500).json({ status: "error", message: "Failed to communicate with ESP32" });
  }
});

// Route to fetch the camera stream from ESP32-CAM
app.get("/api/esp32-cam/stream", async (req, res) => {
  try {
    const response = await axios.get(`http://${ESP32_CAM_IP}/stream`, { responseType: "stream" });
    response.data.pipe(res); // Stream the camera feed directly to the client
  } catch (error) {
    console.error("Error fetching stream from ESP32-CAM:", error.message);
    res.status(500).json({ status: "error", message: "Failed to fetch stream from ESP32-CAM" });
  }
});

// Route to fetch data from ESP32 (e.g., sensor readings)
app.get("/api/esp32/data", async (req, res) => {
  try {
    const response = await axios.get(`http://${ESP32_IP}/status`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from ESP32:", error.message);
    res.status(500).json({ status: "error", message: "Failed to fetch data from ESP32" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
