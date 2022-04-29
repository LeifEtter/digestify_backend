const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const route = require("./routes");

const PORT = 3000
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(route);

app.listen(PORT, () => {
    console.log('listening on 3000')
  })
//app.use(bodyParser.urlencoded({ extended: true }))
//app.use(bodyParser.json());
//app.use(morgan('dev'));
