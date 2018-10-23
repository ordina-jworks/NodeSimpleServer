'use strict';

const express = require('express');

const PORT = 8080;
const app = express();

app.get('www', function (req, res) {
    res.sendfile('./index.html');
});

app.use(express.static(__dirname + '/www'));
app.get('www', function (req, res) {
    res.render('index');
});

app.listen(PORT);