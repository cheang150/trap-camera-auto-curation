var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  const videoData = req.body;
  const videoFile = req.files.object;
  videoFile.mv(`${__dirname}/../public/${videoFile.name}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    videoData.path = `${__dirname}/../public/${videoFile.name}`;
    res.send(videoData);
    // res.json({ path: `${__dirname}/../public/${videoFile.name}` });
    // console.log(videoData);
  });

  //   var spawn = require("child_process").spawn;
  //   var process = spawn("python", [
  //     "../detection/main.py",
  //     req.query.video_file,
  //     req.query.start_time,
  //     req.query.end_time,
  //     req.query.superResponse,
  //     req.query.histResponse,
  //     req.query.autoResponse,
  //   ]);

  //   process.stdout.on("data", function (data) {
  //     console.log(data.toString());
  //   });

  //   process.on("close", (code) => {
  //     console.log(`process quit with ${code}`);
  //     res.send(`completed`);
  //   });
});

module.exports = router;
