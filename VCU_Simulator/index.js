require('dotenv').config();
const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// EMQX Connection settings
const host = process.env.MQTT_HOST || 'broker.emqx.io';
const port = process.env.MQTT_PORT || '1883';
const username = process.env.MQTT_USERNAME || '';
const password = process.env.MQTT_PASSWORD || '';
const protocol = process.env.MQTT_PROTOCOL || 'mqtt';
const clientId = `vcu_sim_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: username,
  password: password,
  reconnectPeriod: 1000,
});

// Simulator state
let isSimulating = false;
let simulationInterval = null;

// The vehicle ID we are simulating
const TARGET_VEHICLE = process.env.VEHICLE_ID || 'VH001';
const TOPIC = process.env.MQTT_TOPIC || 'testtopic/1';

client.on('connect', () => {
  console.log(`✅ Connected to MQTT Broker: ${connectUrl}`);
  
  // Start simulation automatically if desired
  if (process.env.AUTO_START === 'true') {
    startSimulation();
  }
});

client.on('error', (err) => {
  console.error('MQTT Connection Error:', err);
});

// Generate realistic dummy data matching our app's data schema
const generateTelemetry = () => {
  return {
    user: TARGET_VEHICLE,
    v1: (Math.random() * 10 + 70).toFixed(2), // Latitude (dummy)
    v2: (Math.random() * 10 + 70).toFixed(2), // Longitude
    v3: (Math.random() * 50 + 20).toFixed(1), // Speed
    v4: Math.floor(Math.random() * 100).toString(),
    v5: Math.floor(Math.random() * 100).toString(),
    v6: Date.now().toString(), // Crucial: Random changing v6 for heartbeat fallback
    v7: (Math.random() > 0.95 ? 10 : 0).toString(), // Occasional Level 4 fault
    v8: (Math.random() > 0.98 ? 1 : 0).toString(),  // Occasional Level 5 fault
    v32: Math.floor(Math.random() * 100).toString(), // SOC (Battery %)
    v41: Math.floor(Math.random() * 50000).toString(), // Odometer
    v42: ["0", "1", "2", "3"][Math.floor(Math.random() * 4)], // Mode (0=Parked, 1,2=Charging, 3=Motion)
    v44: (Math.random() > 0.5 ? 1 : 0).toString(), // Park flag
    v50: Math.floor(Math.random() * 30 + 35).toString(), // Controller Temp
    v49: Math.floor(Math.random() * 40 + 40).toString(), // Motor Temp
  };
};

const startSimulation = () => {
  if (isSimulating) return;
  isSimulating = true;
  console.log(`🚀 Starting VCU simulation for ${TARGET_VEHICLE} on topic ${TOPIC}`);
  
  simulationInterval = setInterval(() => {
    const payload = generateTelemetry();
    client.publish(TOPIC, JSON.stringify(payload), { qos: 0 }, (error) => {
      if (error) {
        console.error('Publish error:', error);
      } else {
        console.log(`📡 Published packet for ${TARGET_VEHICLE}: SOC=${payload.v32}%, Speed=${payload.v3}km/h`);
      }
    });
  }, 2000); // Publish every 2s
};

const stopSimulation = () => {
  if (!isSimulating) return;
  isSimulating = false;
  clearInterval(simulationInterval);
  console.log(`🛑 Stopped VCU simulation for ${TARGET_VEHICLE}`);
};

// API Endpoints to control the simulator
app.get('/status', (req, res) => {
  res.json({
    status: isSimulating ? 'running' : 'stopped',
    vehicle: TARGET_VEHICLE,
    broker: connectUrl,
    topic: TOPIC
  });
});

app.post('/start', (req, res) => {
  startSimulation();
  res.json({ message: 'Simulation started' });
});

app.post('/stop', (req, res) => {
  stopSimulation();
  res.json({ message: 'Simulation stopped' });
});

// Trigger a one-off custom payload for testing faults
app.post('/trigger-fault', (req, res) => {
  const { faultCode, faultType } = req.body; 
  // faultType 'v7' (Controller) or 'v8' (Battery)
  const payload = generateTelemetry();
  
  if (faultType === 'v7') payload.v7 = faultCode.toString();
  if (faultType === 'v8') payload.v8 = faultCode.toString();

  client.publish(TOPIC, JSON.stringify(payload), { qos: 0 }, (error) => {
    if (error) return res.status(500).json({ error: 'Publish failed' });
    res.json({ message: 'Fault published successfully', payload });
  });
});

app.listen(PORT, () => {
  console.log(`🚗 VCU Simulator API running on http://localhost:${PORT}`);
  console.log(`Control it via POST /start and POST /stop`);
});
