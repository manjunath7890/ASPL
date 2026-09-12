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

// Generate realistic dummy data matching our app's full data schema (v1 to v73)
const generateTelemetry = () => {
  return {
    user: TARGET_VEHICLE,
    v1: (Math.random() * 10 + 70).toFixed(2), // Latitude (dummy)
    v2: (Math.random() * 10 + 70).toFixed(2), // Longitude
    v3: (Math.random() * 50 + 20).toFixed(1), // Speed
    v4: Math.floor(Math.random() * 100),
    v5: Math.floor(Math.random() * 100),
    v6: Date.now(), // Crucial: Random changing v6 for heartbeat fallback
    v7: Math.random() > 0.95 ? 10 : 0, // Occasional Level 4 fault
    v8: Math.random() > 0.98 ? 1 : 0,  // Occasional Level 5 fault
    v9: Math.floor(Math.random() * 150 + 100),
    v10: Math.floor(Math.random() * 2),
    v11: Math.floor(Math.random() * 30 + 10),
    v12: 0,
    v13: Math.floor(Math.random() * 10 + 20),
    v14: Math.floor(Math.random() * 10 + 20),
    v15: Math.floor(Math.random() * 10 + 20),
    v16: Math.floor(Math.random() * 10 + 20),
    v17: (Math.random() * 0.1 + 3.25).toFixed(3),
    v18: (Math.random() * 0.1 + 3.25).toFixed(3),
    v19: 0,
    v22: 223,
    v23: Math.floor(Math.random() * 2),
    v24: 0,
    v32: Math.floor(Math.random() * 100), // SOC (Battery %)
    v33: 0,
    v34: (Math.random() * 10 + 70).toFixed(2),
    v35: (Math.random() * 20 + 120).toFixed(2),
    v36: 0,
    v37: (Math.random() * 2 + 8).toFixed(3),
    v38: 0,
    v39: 0,
    v40: 0,
    v41: Math.floor(Math.random() * 50000), // Odometer
    v42: 3, // Mode (0=Parked, 1,2=Charging, 3=Motion)
    v44: 3,
    v45: Math.floor(Math.random() * 10 + 20),
    v46: Math.floor(Math.random() * 10 + 20),
    v47: 0,
    v49: (Math.random() * 20 + 10).toFixed(5), // Motor Temp
    v50: (Math.random() * 20 + 60).toFixed(5), // Controller Temp
    v51: (Math.random() * 0.1 + 3.25).toFixed(3),
    v52: (Math.random() * 0.1 + 3.25).toFixed(3),
    v53: (Math.random() * 0.1 + 3.25).toFixed(3),
    v54: (Math.random() * 0.1 + 3.25).toFixed(3),
    v55: (Math.random() * 0.1 + 3.25).toFixed(3),
    v56: (Math.random() * 0.1 + 3.25).toFixed(3),
    v57: (Math.random() * 0.1 + 3.25).toFixed(3),
    v58: (Math.random() * 0.1 + 3.25).toFixed(3),
    v59: (Math.random() * 0.1 + 3.25).toFixed(3),
    v60: (Math.random() * 0.1 + 3.25).toFixed(3),
    v61: (Math.random() * 0.1 + 3.25).toFixed(3),
    v62: (Math.random() * 0.1 + 3.25).toFixed(3),
    v63: (Math.random() * 0.1 + 3.25).toFixed(3),
    v64: (Math.random() * 0.1 + 3.25).toFixed(3),
    v65: (Math.random() * 0.1 + 3.25).toFixed(3),
    v66: (Math.random() * 0.1 + 3.25).toFixed(3),
    v67: (Math.random() * 0.1 + 3.25).toFixed(3),
    v68: (Math.random() * 0.1 + 3.25).toFixed(3),
    v69: (Math.random() * 0.1 + 3.25).toFixed(3),
    v70: (Math.random() * 0.1 + 3.25).toFixed(3),
    v71: (Math.random() * 0.1 + 3.25).toFixed(3),
    v72: (Math.random() * 0.1 + 3.25).toFixed(3),
    v73: (Math.random() * 0.1 + 3.25).toFixed(3),
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
