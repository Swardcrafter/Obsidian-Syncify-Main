var express = require('express')
var expressWs = require('express-ws')

var app = express()
expressWs(app)

const fs = require('fs');
const AdmZip = require('adm-zip');

let globalUsername = "";

var data = fs.readFileSync('backend/db.json');

var db = JSON.parse(data);

function saveDB()
{
  fs.writeFile('backend/db.json', JSON.stringify(db), err=> {if (err) {console.error(err);}});
}
function isDictEmpty(obj) {
  // Check if the object has any keys
  return Object.keys(obj).length === 0;
}

function getData() {
  let data = {
    usernames: [],
    emails: [],
    passwords: []
  };

  /*
  Example db entrance:

  !! Whole Db shown here !!

  {
    Username111: {
      email: "example@1234mail.com",
      password: "1234"
    }
  }
	*/
  
  if(!isDictEmpty(db)) {
    for (const key in db) {
      data.usernames.push(key);
      data.emails.push(db[key].email);
      data.passwords.push(db[key].password);
    }
    return data;
  }
  return false;
  
}

function logIn(username, password, ws) {
  data = getData();
	let found = false;
  if(data != false) {
    data.usernames.forEach(item => {
      if(item == username) {
        found = true;
      }
    });
    if(found == false) {
      ws.send(JSON.stringify({type: "error", error: "noAccount"}));
    } else if (found == true) {
      if(db[username].password == password) {
				const directoryPath = `backend/savedFiles/${username}/`;
				fs.readdir(directoryPath, (err, files) => {
			  console.log(files);
        ws.send(JSON.stringify({
          type: "log", 
          userInfo: {
            username: username,
            password: password,
            files: files
          }}))
        globalUsername = username;
			});
      } else {
        ws.send(JSON.stringify({type: "error", error: "wrongPassword"}));
      }
    }
  }
}

function checkForUsername(username) {
  data = getData();
  let found = false;
  if(data != false) {
    data.usernames.forEach(item => {
      if(item == username) {
        found = true;
      }
    });
    return found;
  }
}

function createAccount(username, email, password) {
  db[username] = {
    email: email, 
    password: password
  };
  saveDB()
}

function signUp(username, email, password, ws) {
  if(!checkForUsername(username)) {
    createAccount(username, email, password);
    const directoryPath = `backend/savedFiles/${username}/`;
		console.log(globalUsername);
    fs.readdir(directoryPath, (err, files) => {
      console.log(files);
      ws.send(JSON.stringify({
        type: "log", 
        userInfo: {
          username: username,
          password: password,
          files: files
        }}))
      globalUsername = username;
		});
  } else {
    ws.send(JSON.stringify({type: "error", error: "usernameExists"}));
  }
}

function saveFile(filename, content) {
	filename = filename.replace(/[<>:"/\\|?*]/g, '');
  const filePath = `backend/savedFiles/${globalUsername}/${filename}`;

  const userDirectoryPath = `backend/savedFiles/${globalUsername}`;
  if (!fs.existsSync(userDirectoryPath)) {
    fs.mkdirSync(userDirectoryPath, { recursive: true });
  }

  // Step 1: Create the file and write content to it
  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`File "${filename}" created.`);
}

function deleteFile(filename) {

}


app.ws('/echo', (ws) => {
	console.log("New client connected.");

    ws.on("message", data => {
        data = JSON.parse(data);
		console.log(JSON.stringify(data));
    if(data.type == "log"){
      logIn(data.info.username, data.info.password, ws);
    } else if (data.type == "sign") {
      signUp(data.info.username, data.info.email, data.info.password, ws);
    } else if (data.type == "file") {
      saveFile(data.info.filename, data.info.contents);
    } else if (data.type == "delete") {
      deleteFile(data.info.filename);
    }
	});
	ws.on('close', () => {
        console.log(`Client has disconnected!`);
        saveDB();
    });
});

const path=require('path');
let oneStepBack=path.join(__dirname,'../');
app.use("/frontend", express.static(path.join(__dirname, "frontend")));
app.get("/", (req, res) => {
  // Send the index.html file
  res.sendFile(path.join(oneStepBack, "/frontend/index.html"));
});

app.get("/style.css", (req, res) => {
	// Send the styles.css file with the correct MIME type
	res.type("text/css");
	res.sendFile(path.join(oneStepBack, "/frontend/style.css"));
  });
  app.get("/style2.css", (req, res) => {
    // Send the styles.css file with the correct MIME type
    res.type("text/css");
    res.sendFile(path.join(oneStepBack, "/frontend/style2.css"));
    });

app.get("/frontendws.js", (req, res) => {
	res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(oneStepBack, "/frontend/frontendws.js"));
});
app.get("/index.js", (req, res) => {
	res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(oneStepBack, "/frontend/index.js"));
});
app.get("/background.png", (req, res) => {
  res.sendFile(path.join(oneStepBack, "/frontend/background.png"));
});
app.get("/main.php", (req, res) => {
	res.sendFile(path.join(oneStepBack, "/frontend/main.php"));
  });
app.listen(8081, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", 8081);
});