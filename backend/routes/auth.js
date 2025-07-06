const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw error;
    res.json({ user: data.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    res.json({ user: data.user, session: data.session });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;