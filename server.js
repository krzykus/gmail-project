//--Express--//
const express = require('express');
const app = express();
const port = 3001;

//--Cors--//
//required for cross origin requests
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }
const cors = require('cors')(corsOptions);

//--Express Middleware--//
app.use(cors);
app.use(express.json());


//--Routes--//
app.get('/ping', (req, res) => {
    res.send("pong");
})

//--Start Server--//
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});