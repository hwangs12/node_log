var fs = require("fs");
var readableStream = fs.createReadStream("file.txt");
var data = "";
var chunk;

readableStream.on("readable", function () {
    console.time("reading chunk");
    console.log("CHUNK-----------------------");
    console.log(readableStream.read());
    console.log("CHUNK-----------------------");
    console.timeEnd("reading chunk");
    while ((chunk = readableStream.read()) != null) {
        data += chunk;
    }
});

readableStream.on("end", function () {
    console.log(data);
});
