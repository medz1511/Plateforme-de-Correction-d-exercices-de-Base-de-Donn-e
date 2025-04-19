// routes/parametreIARoutes.js
const router = require('express').Router();
const svc = require('../services/parametreIAService');

router.get('/', async (req, res) => res.json(await svc.getAll()));
router.put('/', async (req, res) =>
  res.json(await svc.updateParam(req.body.nom, req.body.valeur))
);

module.exports = router;
