// backend/routes/authRoutes.js
const router = require('express').Router();
const authSvc = require('../services/authService');

// Register
router.post('/register', async (req, res) => {
  try {
    const user = await authSvc.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const payload = await authSvc.login(req.body);
    res.json(payload);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Logout (pour JWT c’est côté client, on fournit juste un endpoint factice)
router.get('/logout', (req, res) => {
  res.json({ message: 'Déconnecté' });
});

router.get('/', (req, res) => {
  res.send('Bienvenue sur notre API AUTH !');
});
module.exports = router;
