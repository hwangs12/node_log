const fs = require("fs");
const http = require("http");
const path = require("path");

let sum = 0;

http.createServer(function (req, res) {
    //NOTE: This assumes your index.html file is in the
    // same location as your root application
    const url = req.url;

    if (url === "/") {
        const filePath = path.join(__dirname, "index.html");
        const stat = fs.statSync(filePath);
        res.writeHead(200, {
            "Content-Type": "text/html",
            "content-Length": stat.size,
        });

        var stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } else if (url === "/video") {
        const range = req.headers.range;
        if (!range) {
            res.statusCode(400).send("Requires Range header");
        }

        const videoPath = "sample-30s.mp4";

        // this gives you the byte size of the video in string
        const videoSize = fs.statSync(videoPath).size;

        console.log("???videosize???");
        console.log(videoSize);
        console.log("???videosize???");

        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        // how the hell is this determined?
        const start = Number(range.replace(/\D/g, ""));
        console.log("what the hell is range???");
        console.log(start);
        console.log("what the hell is range???");
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        console.log(sum);
        sum += (end - start) / Number(videoSize);
        console.log(req.headers.range, "----", start);
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);

        const videoStream = fs.createReadStream(videoPath, { start, end });

        videoStream.pipe(res);
    }
}).listen(8000);
