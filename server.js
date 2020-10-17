const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;

require("./models");

// configure body parser for AJAX requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);


app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});