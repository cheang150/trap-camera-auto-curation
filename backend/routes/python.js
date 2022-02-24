var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  var videoData = req.body;
  const videoFile = req.files.object;
  videoFile.mv(`${__dirname}/../public/${videoFile.name}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    videoData.path = `${__dirname}/../public/${videoFile.name}`;
    videoData = JSON.stringify(videoData);
    console.log(videoData);

    try {
      var spawn = require("child_process").spawn;
      var process = spawn("python", [`${__dirname}/main.py`, videoData]);

      process.on("error", function (err) {
        console.log(err);
      });

      process.stdout.on("data", function (data) {
        console.log(data.toString());
      });

      process.on("close", (code) => {
        console.log(`process quit with ${code}`);
        res.send(`completed`);
      });
    } catch (err) {
      console.log("spawn error:" + err);
    }
  });
});

module.exports = router;
