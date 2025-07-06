const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.use(authenticateToken);

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    let user = await User.findBySupabaseId(req.user.id);
    
    if (!user) {
      // Create user if doesn't exist
      user = await User.createOrUpdateFromSupabase(req.user);
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    const user = await User.findOneAndUpdate(
      { supabaseId: req.user.id },
      { 
        name: name || '',
        preferences: preferences || {}
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get users for project assignment (search by email)
router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }
    
    const users = await User.find(
      { 
        email: { $regex: email, $options: 'i' },
        isActive: true 
      },
      { email: 1, name: 1, avatar: 1 }
    ).limit(10);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;