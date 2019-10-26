import React, { useState } from "react";
import "./App.css";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import axios from "axios";
import { saveAs } from "file-saver";
import { Button } from "@material-ui/core";
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const ytdl = require("ytdl-core");
//const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const readline = require("readline");
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3"
    }
  }
});

function App() {
  const [data, setdata] = useState("");
  const download = () => {
    const url = "https://youtu.be/IGQBtbKSVhY";
    // const audioOutput = path.resolve(__dirname, "sound.mp4");
    // const mainOutput = path.resolve(__dirname, "output.mp4");
    console.log("downloading audio track");

    // axios
    //   .post("/create-pdf")
    //   .then(() => axios.get("fetch-pdf", { responseType: "blob" }))
    //   .then(res => {
    //     const pdfBlob = new Blob([res.data], { type: "application/pdf" });

    //     saveAs(pdfBlob, "newPdf.mp3");
    //   });
    // axios
    //   .get(url)
    //   .then(res => {
    axios
      .get(`/download`, {
        params: {
          videoId: url
        },
        method: "GET",
        responseType: "blob"
      })
      .then(stream => {
        console.log(stream);
        axios
          .get("/info", {
            params: {
              videoId: url
            },
            method: "GET"
          })
          .then(response => {
            console.log(response.data);

            const file = new Blob([stream.data], { type: "audio/mpeg" });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            saveAs(file, response.data);
          });
      })
      .catch(err => {
        console.log("ERROR", err);
      });
    //})
    // .catch(err => {
    //   console.log("ERROR", err);
    // });
  };
  return (
    <div className="main">
      <MuiThemeProvider theme={theme}>
        <TextField
          onChange={e => {
            setdata(e.target.value);
          }}
          fullWidth
          id="standard-name"
          label="Name"
          margin="normal"
          style={{ margin: 30 }}
        />
      </MuiThemeProvider>
      <Button variant="contained" color="primary" onClick={download}>
        Download
      </Button>
    </div>
  );
}

export default App;

/*
// ytdl(url, {
    //   filter: format => format.container === "m4a" && !format.encoding
    // })
    //   .on("error", console.error)
    //   .on("progress", (chunkLength, downloaded, total) => {
    //     const percent = downloaded / total;
    //   })

    // Write audio to file since ffmpeg supports only one input stream.
    //.pipe(fs.createWriteStream(audioOutput));
    //buffer => FileSaver.saveAs(new Blob([buffer]), `${Date.now()}_feedback.xlsx`)

    //.pipe(fs.createWriteStream("./download"));
    const id = "https://youtu.be/NID-2orTN8U?list=RD8ex38L8xtNI";
    let stream = ytdl(id, {
      quality: "highestaudio"
      //filter: 'audioonly',
    });
    let start = Date.now();
    ffmpeg(stream)
      .audioBitrate(128)
      // .pipe(
      //   outputStream,
      //   {
      //     end: true
      //   }
      // )
      // .save(`${__dirname}/${id}.mp3`)
      .on("progress", p => {
        console.log(`${p.targetSize}kb downloaded`);

        //readline.cursorTo(process.stdout, 0);
        //process.stdout.write(`${p.targetSize}kb downloaded`);
      })
      .on("end", () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
        const file = new Blob([stream.data], { type: "audio/mpeg" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        console.log(fileURL);
      });

    console.log(data);

    //   axios.get(url)
    // .then(res => {
    //   axios(`${url}/download`, {
    //     method: 'GET',
    //     responseType: 'blob'
    //   })
    //     .then(stream => {
    //       const file = new Blob(
    //         [stream.data],
    //         { type: 'audio/mpeg' });
    //       //Build a URL from the file
    //       const fileURL = URL.createObjectURL(file);
    //     })
    //     .catch(err => {
    //       console.log('ERROR', err);
    //     });
    //   })
    //   .catch(err => {
    //     console.log('ERROR', err);
    //   });

    */
