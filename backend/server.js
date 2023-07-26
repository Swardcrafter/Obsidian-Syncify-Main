var express = require('express')
var expressWs = require('express-ws')

var app = express()
expressWs(app)


app.ws('/echo', (ws) => {
    ws.on("message", data => {
        data = JSON.parse(data);
	});
});

const path=require('path');
let oneStepBack=path.join(__dirname,'../');
app.use("/backend", express.static(__dirname + '/backend'));
app.get("/", (req, res) => {
  // Send the index.html file
  res.sendFile(path.join(oneStepBack, "frontend/index.html"));
});

app.get("/styles.css", (req, res) => {
  // Send the styles.css file
  res.sendFile(path.join(oneStepBack, "frontend/styles.css"));
});

app.get("/index.js", (req, res) => {
  // Send the index.js file
  res.sendFile(path.join(oneStepBack, "frontend/frontendws.js"));
});
app.listen(8081, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", 8081);
});