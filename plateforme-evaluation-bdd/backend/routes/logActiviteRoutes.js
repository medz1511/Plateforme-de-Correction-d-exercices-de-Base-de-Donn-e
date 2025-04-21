// routes/notificationRoutes.js
const router = require('express').Router();
const svc = require('../services/notificationService');

router.get('/user/:userId', async (req, res) =>
  res.json(await svc.getByUser(req.params.userId))
);
router.put('/:id/read', async (req, res) =>
  res.json(await svc.markAsRead(req.params.id))
);

module.exports = router;
