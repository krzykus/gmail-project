const app = require('express')();
const port = 3001;

//required for cross origin requests
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }
const cors = require('cors')(corsOptions);

app.use(cors);
app.use(express.json());

app.get('/ping', (req, res) => {
    res.send(pong);
})


app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});