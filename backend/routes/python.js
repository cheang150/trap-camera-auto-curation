const { response } = require("express");
var express = require("express");
var fs = require("fs");
var router = express.Router();

router.get("/", function (req, res, next) {
  // console.log(req.query.path);
  const path = req.query.path;
  const list = fs.readdirSync(path);
  const responses = [];
  for (var file of list) {
    var buffer = fs.readFileSync(`${path}/${file}`);
    var bufferBase64 = new Buffer.from(buffer);
    responses.push(bufferBase64.toString("base64"));
  }
  res.send(responses.toString("base64"));

  // var buffer = fs.readFileSync(
  //   "/Users/cheang150/Desktop/Trap-Camera-Auto-Curation/trap-camera-auto-curation/backend/results/Mega/high.mp4/final 8_crop00_detections.jpg"
  //   // ,{ encoding: "base64" }
  // );
  // var bufferBase64 = new Buffer.from(buffer);
  // res.send(bufferBase64.toString("base64"));
});

router.post("/", function (req, res, next) {
  var videoData = req.body;
  const videoFile = req.files.object;
  videoFile.mv(`${__dirname}/../public/${videoFile.name}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    videoData.path = `${__dirname}/../public/${videoFile.name}`;

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
        // res.send([
        //   "File path:C:\\Users\\chang\\Documents\\GitHub\\Integrated\\backend\\routes/../public/high_Trim.mp4\r\n" +
        //     "\r\n" +
        //     "Start time:00:00\r\n" +
        //     "\r\n" +
        //     "End time:03:03\r\n",
        //   "\r\nResolution:1\r\n\r\nHistogram:1\r\n\r\nEnhance:1\r\n\r\n0\r\n\r\n183\r\n\r\n",
        //   "Video length: 0:03:03.300000\r\n\r\n",
        //   'Moviepy - Running:\r\n>>> "+ " ".join(cmd)\r\n',
        //   "Moviepy - Command successful\r\n",
        //   "[+] Running...\r\n\r\n",
        //   "Images Captured: 246\r\n\r\nImages Filtered: 211\r\n",
        //   "\r\n" +
        //     "Images Shortlisted: 5\r\n" +
        //     "\r\n" +
        //     "Background Subtraction results path: C:\\Users\\chang\\Documents\\GitHub\\Integrated\\backend\\results\\Background\\high_Trim.mp4\r\n" +
        //     "\r\n" +
        //     "[+] Background Subtraction Process finished!\r\n" +
        //     "\r\n",
        //   "Images Received: 5\r\n\r\nImages Selected: 1\r\n\r\n",
        //   "Images Created: 1\r\n" +
        //     "\r\n" +
        //     "Mega results path: C:\\Users\\chang\\Documents\\GitHub\\Integrated\\backend\\results\\Mega\\high_Trim.mp4\r\n" +
        //     "\r\n" +
        //     "[+] Mega Process finished!\r\n" +
        //     "\r\n",
        // ]);
      });
    } catch (err) {
      console.log("spawn error:" + err);
    }
  });
});

module.exports = router;
