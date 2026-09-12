const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');

// GET / — all users
router.get('/', async (req, res) => {
  try {
    const data = await User.find();
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No users found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /dealer — users by dealerToken
router.get('/dealer', async (req, res) => {
  const { dealerToken } = req.query;
  if (!dealerToken) {
    return res.status(400).json({ error: 'dealerToken not provided' });
  }

  try {
    const data = await User.find({ dealerToken });
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No users found for the provided dealerToken' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /:id — delete user by _id
router.delete('/user/delete/:id', async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// PUT /:id — update user by _id
router.put('/user/update/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (user) {
      res.json({ message: 'User updated successfully', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
