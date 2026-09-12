const express = require('express');
const router = express.Router();
const FaultCode = require('../model/faultCodeSchema');

// POST / — create new fault code entry
router.post('/', async (req, res) => {
  try {
    const newFaultCode = new FaultCode(req.body);

    // Check duplicate for same vehicleNo and date
    const existing = await FaultCode.findOne({
      vehicleNo: newFaultCode.vehicleNo,
      date: newFaultCode.date,
    });

    if (existing) {
      return res.status(409).json({ error: 'Fault code already exists for this vehicle and date' });
    }

    // Validate faultCode object
    if (typeof newFaultCode.faultCode !== 'object' || newFaultCode.faultCode === null) {
      return res.status(400).json({ error: 'Fault code object is required' });
    }

    const code = newFaultCode.faultCode;
    const booleanFields = [
      'Motor', 'Battery', 'Charger', 'Controller', 'DC_DCConverter',
      'VCU', 'Telematics', 'Cluster', 'GearBox', 'GearBoxController',
      'HeadLight', 'TurnIndicator', 'HandBrake', 'Brake', 'Accelerator',
    ];

    const invalidField = booleanFields.find((f) => typeof code[f] !== 'boolean');
    if (invalidField) {
      return res.status(400).json({ error: `Invalid fault code format: ${invalidField} must be boolean` });
    }

    // Set defaults
    newFaultCode.date = new Date(newFaultCode.date);
    newFaultCode.dealer = newFaultCode.dealer || 'Unknown Dealer';
    newFaultCode.vehicleType = newFaultCode.vehicleType || 'Unknown Vehicle Type';
    newFaultCode.motorType = newFaultCode.motorType || 'Unknown Motor Type';
    newFaultCode.batteryKW = newFaultCode.batteryKW || 'Unknown Battery kWatt';
    newFaultCode.location = newFaultCode.location || 'Unknown Location';
    newFaultCode.condition = newFaultCode.condition || 'Unknown Condition';
    newFaultCode.role = newFaultCode.role || 'Unknown Role';
    newFaultCode.accessToken = newFaultCode.accessToken || 'Unknown Access Token';
    newFaultCode.dealerToken = newFaultCode.dealerToken || 'Unknown Dealer Token';
    newFaultCode.financeToken = newFaultCode.financeToken || 'Unknown Finance Token';
    newFaultCode.vehicleNo = newFaultCode.vehicleNo || 'Unknown Vehicle Number';

    await newFaultCode.save();
    res.status(201).json({ message: 'Fault code saved successfully' });
  } catch (err) {
    console.error('Fault code create error:', err);
    res.status(500).json({ error: 'An error occurred while saving the fault code' });
  }
});

// GET / — get fault codes with role-based filtering
router.get('/', async (req, res) => {
  const { role, start, end, dealerToken, accessToken } = req.query;

  try {
    const query = {};

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    query.date = { $gte: startDate, $lte: endDate };

    if (role === 'admin') {
      // Admin sees all data within date range
    } else if (role === 'dealer') {
      if (!dealerToken) {
        return res.status(400).json({ error: 'Missing dealerToken' });
      }
      query.dealerToken = dealerToken;
    } else if (role === 'customer') {
      if (!accessToken) {
        return res.status(400).json({ error: 'Missing accessToken' });
      }
      query.accessToken = accessToken;
    } else {
      return res.status(403).json({ error: 'Invalid role cannot access the data' });
    }

    const faultCodes = await FaultCode.find(query);
    if (!faultCodes || faultCodes.length === 0) {
      return res.status(404).json({ error: 'No fault codes found' });
    }

    res.status(200).json(faultCodes);
  } catch (err) {
    console.error('Fault code fetch error:', err);
    res.status(500).json({ error: 'An error occurred while fetching fault codes' });
  }
});

// PUT /:id — update fault code
router.put('/:id', async (req, res) => {
  try {
    const faultCode = await FaultCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (faultCode) {
      res.json({ message: 'Fault code updated successfully', faultCode });
    } else {
      res.status(404).json({ error: 'Fault code not found' });
    }
  } catch (err) {
    console.error('Fault code update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /:id — delete fault code
router.delete('/:id', async (req, res) => {
  try {
    const result = await FaultCode.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({ message: 'Fault code deleted successfully' });
    } else {
      res.status(404).json({ error: 'Fault code not found' });
    }
  } catch (err) {
    console.error('Fault code delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
