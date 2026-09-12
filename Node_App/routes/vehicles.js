const express = require('express');
const router = express.Router();
const Vehicle = require('../model/registerSchema');

// POST /register — register new vehicle
router.post('/register', async (req, res) => {
  const {
    vehicleNo, vehicleId, name, motorNo, chassiNo,
    batteryId, accessToken, financeToken,
  } = req.body;

  try {
    const existing = await Vehicle.findOne({ vehicleId });
    if (existing) {
      return res.status(409).json({ error: 'Vehicle already registered' });
    }

    const vehicle = new Vehicle({
      vehicleNo, vehicleId, name, motorNo, chassiNo,
      batteryId, accessToken, financeToken,
    });
    await vehicle.save();

    res.status(201).json({ message: 'Vehicle registered successfully' });
  } catch (err) {
    console.error('Vehicle register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET / — all vehicles
router.get('/', async (req, res) => {
  try {
    const data = await Vehicle.find();
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No vehicles found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /fleet — vehicles by accessToken
router.get('/fleet', async (req, res) => {
  const { accessToken } = req.query;
  if (!accessToken) {
    return res.status(400).json({ error: 'accessToken not provided' });
  }

  try {
    const data = await Vehicle.find({ accessToken });
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No vehicles found for the provided accessToken' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /dealer — vehicles by dealerToken
router.get('/dealer', async (req, res) => {
  const { dealerToken } = req.query;
  if (!dealerToken) {
    return res.status(400).json({ error: 'dealerToken not provided' });
  }

  try {
    const data = await Vehicle.find({ dealerToken });
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No vehicles found for the provided dealerToken' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /financer — vehicles by financeToken
router.get('/financer', async (req, res) => {
  const { financeToken } = req.query;
  if (!financeToken) {
    return res.status(400).json({ error: 'financeToken not provided' });
  }

  try {
    const data = await Vehicle.find({ financeToken });
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No vehicles found for the provided financeToken' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /:id — delete vehicle by vehicleId
router.delete('/:id', async (req, res) => {
  try {
    const result = await Vehicle.deleteOne({ vehicleId: req.params.id });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting vehicle' });
  }
});

// PUT /:id — update vehicle by vehicleId
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { vehicleId: req.params.id },
      req.body,
      { new: true }
    );
    if (vehicle) {
      res.json({ message: 'Vehicle updated successfully', vehicle });
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
