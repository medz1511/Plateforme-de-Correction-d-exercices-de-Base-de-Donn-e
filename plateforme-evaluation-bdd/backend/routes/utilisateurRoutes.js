// routes/utilisateurRoutes.js
const router = require('express').Router();
const svc = require('../services/utilisateurService');

router.get('/', async (req, res) => res.json(await svc.getAll()));
router.get('/:id', async (req, res) => res.json(await svc.getById(req.params.id)));
router.post('/', async (req, res) => res.json(await svc.create(req.body)));
router.put('/:id', async (req, res) => res.json(await svc.update(req.params.id, req.body)));
router.delete('/:id', async (req, res) => res.json(await svc.remove(req.params.id)));

module.exports = router;
