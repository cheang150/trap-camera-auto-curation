var express = require("express");
var fs = require("fs");
var router = express.Router();

router.get("/", function (req, res, next) {
  const path = req.query.path;
  const list = fs.readdirSync(path);
  const responses = [];
  for (var file of list) {
    var buffer = fs.readFileSync(`${path}/${file}`);
    var bufferBase64 = new Buffer.from(buffer);
    responses.push(bufferBase64.toString("base64"));
  }
  res.send(responses.toString("base64"));
});

router.post("/", function (req, res, next) {
  var videoData = req.body;
  const videoFile = req.files.object;
  videoFile.mv(`${__dirname}/../public/${videoFile.name}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    videoData.path = `${__dirname}/../public/${videoFile.name}`;

    // res.send([
    //   "Moviepy - Running:\r\n" +
    //     '>>> "+ " ".join(cmd)\r\n' +
    //     "Moviepy - Command successful\r\n" +
    //     "Images Captured: 62\r\n" +
    //     "\r\n" +
    //     "Images Shortlisted: 6\r\n" +
    //     "\r\n" +
    //     "Background Subtraction results path: /Users/cheang150/Desktop/Trap-Camera-Auto-Curation/trap-camera-auto-curation/backend/results/Background/high.mp4\r\n" +
    //     "\r\n" +
    //     "Images Created: Hard-coded 88\r\n" +
    //     "\r\n" +
    //     "Mega results path: /Users/cheang150/Desktop/Trap-Camera-Auto-Curation/trap-camera-auto-curation/backend/results/Mega/high.mp4\r\n" +
    //     "\r\n",
    // ]);
    var logging = [];
    try {
      var spawn = require("child_process").spawn;
      var process = spawn("python", [
        `script/main.py`,
        videoData.path,
        videoData.startTime,
        videoData.endTime,
        videoData.resolutionModel,
        videoData.histogramEq,
        videoData.autoEnhance,
      ]);

      process.on("error", function (err) {
        console.log(err);
      });

      process.stdout.on("data", function (data) {
        logging.push(data.toString());
      });

      process.on("close", (code) => {
        console.log(logging);
        console.log(`process quit with ${code}`);
        res.send(logging);
      });
    } catch (err) {
      console.log("spawn error:" + err);
    }
  });
});

module.exports = router;
