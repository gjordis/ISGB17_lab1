'use strict';

//Filen app.js är den enda ni skall och tillåts skriva kod i.
const express = require('express');
const jsDom = require('jsdom');
const cookieParser = require('cookie-parser');
const globalObject = require('./servermodules/game-modul');
const fs = require('fs');

const app = express();

app.listen(3000, function() {
    console.log('server uppe');
})
