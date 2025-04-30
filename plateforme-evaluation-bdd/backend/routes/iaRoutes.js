const express = require("express");
const router  = express.Router();
const { correctSubmissionsForSujet } = require("../services/iaService");

router.post("/correct/:sujetId", async (req, res) => {
  try {
    const sujetId = parseInt( req.params.sujetId, 10 );
    const count   = await correctSubmissionsForSujet(sujetId);
    res.json({ message: "Corrections terminées", total: count });
  } catch (err) {
    console.error("[IA Route]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
