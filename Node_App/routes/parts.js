const express = require('express');
const router = express.Router();
const VehicleParts = require('../model/vehicleSchema');

// POST / — add or update vehicle parts
router.post('/', async (req, res) => {
  const { chassisNumber } = req.body;

  try {
    const existingVehicle = await VehicleParts.findOne({ chassisNumber });
    if (existingVehicle) {
      await VehicleParts.updateOne({ chassisNumber }, req.body);
      res.status(200).json({ message: 'Vehicle updated successfully' });
    } else {
      const newVehicle = new VehicleParts(req.body);
      await newVehicle.save();
      res.status(201).json({ message: 'Vehicle created successfully' });
    }
  } catch (err) {
    console.error('Error creating/updating vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /:chassisnumber — get vehicle parts (latest of each)
router.get('/:chassisnumber', async (req, res) => {
  const { chassisnumber } = req.params;

  try {
    const existingVehicle = await VehicleParts.findOne({ chassisNumber: chassisnumber });
    if (!existingVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const latestPartById = new Map();
    existingVehicle.parts.forEach((part, index) => {
      const current = latestPartById.get(part.partId);
      const partTime = new Date(part.dateInstalled).getTime();
      const currentTime = current
        ? new Date(current.part.dateInstalled).getTime()
        : Number.NEGATIVE_INFINITY;
      const safePartTime = Number.isNaN(partTime) ? Number.NEGATIVE_INFINITY : partTime;
      const safeCurrentTime = Number.isNaN(currentTime) ? Number.NEGATIVE_INFINITY : currentTime;

      if (
        !current ||
        safePartTime > safeCurrentTime ||
        (safePartTime === safeCurrentTime && index > current.index)
      ) {
        latestPartById.set(part.partId, { part, index });
      }
    });

    const latestParts = Array.from(latestPartById.values()).map((entry) => entry.part);
    res.status(200).json({ ...existingVehicle._doc, parts: latestParts });
  } catch (err) {
    console.error('Error fetching vehicle parts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /:chassisNumber/:partId — delete a part
router.delete('/:chassisNumber/:partId', async (req, res) => {
  try {
    const { chassisNumber, partId } = req.params;
    const vehicle = await VehicleParts.findOne({ chassisNumber });

    if (!vehicle) {
      return res.status(404).json({ error: 'Chassis number not found' });
    }

    vehicle.parts = vehicle.parts.filter((part) => part.partId !== partId);
    await vehicle.save();
    res.status(200).json({ message: 'Part deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete the part' });
  }
});

// PUT /:chassisNumber/:partId — edit part (append new version)
router.put('/:chassisNumber/:partId', async (req, res) => {
  try {
    const { chassisNumber, partId } = req.params;
    const updatedPart = req.body || {};

    const vehicle = await VehicleParts.findOne({ chassisNumber });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    let partIndex = -1;
    for (let i = vehicle.parts.length - 1; i >= 0; i -= 1) {
      if (vehicle.parts[i].partId === partId) {
        partIndex = i;
        break;
      }
    }
    if (partIndex === -1) {
      return res.status(404).json({ error: 'Part not found' });
    }

    const basePart =
      typeof vehicle.parts[partIndex].toObject === 'function'
        ? vehicle.parts[partIndex].toObject()
        : vehicle.parts[partIndex];

    const partCopy = { ...basePart, ...updatedPart, partId };
    delete partCopy._id;
    delete partCopy.__v;

    vehicle.parts.push(partCopy);
    await vehicle.save();

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:chassisNumber/:partId/history — replacement history for a part
router.get('/:chassisNumber/:partId/history', async (req, res) => {
  try {
    const { chassisNumber, partId } = req.params;

    const vehicle = await VehicleParts.findOne({ chassisNumber });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const partsWithSameId = vehicle.parts.filter((part) => part.partId === partId);
    if (partsWithSameId.length === 0) {
      return res.status(404).json({ error: 'No parts found with the specified partId' });
    }

    res.json(partsWithSameId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
