//#region boilerplate
//Express
const express = require('express');
const app = express();
const port = 3001;

//Cors
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }
const cors = require('cors')(corsOptions);

//AppSettings
const googleCredentials = JSON.parse(fs.readFileSync('credentials.json'));
//#endregion

//#region Express Middleware
app.use(cors);
app.use(express.json());
//#endregion

//#region controllers
const GmailController = require('./domains/gmail/controller');
GmailController(app, googleCredentials);
//#endregion

//#region Routes (Ping only)
app.get('/ping', (req, res) => {
    res.send("pong");
});
//#endregion

//#region Start Server
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});
//#endregion