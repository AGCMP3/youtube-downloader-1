const express = require("express");

const cors = require("cors");
const serverless = require("serverless-http");
const app = express();
const ytdl = require("ytdl-core");
//const port = process.env.PORT || 5000;

// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);
//const ffmpeg = require("fluent-ffmpeg");

const readline = require("readline");
app.use(cors());

// app.post("/create-pdf", (req, res) => {
//   pdf.create(pdfTemplate(req.body), {}).toFile("result.pdf", err => {
//     if (err) {
//       res.send(Promise.reject());
//     }

//     res.send(Promise.resolve());
//   });
// });

app.get("/download", (req, res) => {
  console.log(req.query.videoId);
  const videoId = req.query.videoId;
  console.log("downloading audio track");

  ytdl(videoId, {
    filter: format => format.container === "m4a" && !format.encoding,
    quality: "highestaudio"
  })
    .on("error", console.error)
    .on("progress", (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
      process.stdout.write(
        `(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(
          total /
          1024 /
          1024
        ).toFixed(2)}MB)`
      );
    })
    .pipe(res);
});
app.get("/info", (req, res) => {
  const videoId = req.query.videoId;
  ytdl.getInfo(videoId).then(info => {
    console.log(info.title);

    res.send(info.title);
  });
});

module.exports.handler = serverless(app);
//app.listen(port, () => console.log(`Listening on port ${port}`));

// let video = ytdl(videoId, {
//   filter: format => format.container === "mp4" && format.audioEncoding,
//   quality: "lowest"
// }).on("progress", (chunkLength, downloaded, total) => {
//   const percent = downloaded / total;
//   readline.cursorTo(process.stdout, 0);
//   process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
//   process.stdout.write(
//     `(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(
//       total /
//       1024 /
//       1024
//     ).toFixed(2)}MB)`
//   );
// });
// ytdl.getInfo(videoId).then(info => {
//   console.log(info.video_id);

//   let stream = new ffmpeg()
//     .input(video)

//     .input(`https://img.youtube.com/vi/${info.video_id}/default.jpg`)
//     //.input(`https://img.youtube.com/vi/CqHKfscXS64/default.jpg`)
//     .outputOptions([
//       "-map 0:1",
//       "-map 1:0",
//       "-c copy",
//       "-c:a libmp3lame",
//       "-id3v2_version 3",
//       '-metadata:s:v title="Album cover"',
//       '-metadata:s:v comment="Cover (front)"'
//     ])
//     .format("mp3")
//     .pipe(res);
// });

// Write audio to file since ffmpeg supports only one input stream.

//res.sendFile(stream);
//   stream.pipe(res);
//   stream
//     .on("end", () => {
//       console.log("******* Stream end *******");
//       res.end.bind(res);
//     })
//     .on("error", err => {
//       console.log("ERR", err);
//       res.status(500).end.bind(res);
//     });
