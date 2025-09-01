const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  });
});

module.exports = router;
