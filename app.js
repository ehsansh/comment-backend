require('dotenv').config({ path: './config/.env' });
const express = require('express');
const app = express();
const corsOptions = require('./config/corsOptions');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

const cors = require('cors');
const credentials = require('./middleware/credentials');
const routes = require('./routes.js');

app.use(credentials);
app.use(cors(corsOptions));

routes(app);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
