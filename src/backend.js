let video = ytdl(`http://youtube.com/watch?v=${videoId}`, {
  filter: format => format.container === "mp4" && format.audioEncoding,
  quality: "lowest"
});

let stream = new FFmpeg()
  .input(video)
  .addInput(`https://i.ytimg.com/vi/${videoId}/default.jpg`)
  .outputOptions([
    "-map 0:1",
    "-map 1:0",
    "-c copy",
    "-c:a libmp3lame",
    "-id3v2_version 3",
    '-metadata:s:v title="Album cover"',
    '-metadata:s:v comment="Cover (front)"'
  ])
  .format("mp3");
stream.pipe(res);
stream
  .on("end", () => {
    console.log("******* Stream end *******");
    res.end.bind(res);
  })
  .on("error", err => {
    console.log("ERR", err);
    res.status(500).end.bind(res);
  });
