var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  const videoFile = req.files.object;
  videoFile.mv(`${__dirname}/../public/${videoFile.name}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ path: `${__dirname}/../public/${videoFile.name}` });
  });
});

module.exports = router;
