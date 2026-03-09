const { Router } = require("express");

const router = Router();

router.post('/', (req, res) => {
  res.json(req.body);
});

module.exports = router;