'use strict';

//Filen app.js är den enda ni skall och tillåts skriva kod i.
const express = require('express'); //konstant som hämtar express biblioteket
const jsDom = require('jsdom'); // konstant som hämtar jsdom biblioteket
const cookieParser = require('cookie-parser'); // konstant som hämtar cookie-parser biblioteket
const globalObject = require('./servermodules/game-modul'); // konstant som hämtar game-modul
const fs = require('fs'); // konstant som hämtar File System biblioteket

// konstant att använda för att hantera middleware, lyssnare
const app = express(); 

// startar webbwervern och lyssnar efter anrop på 3000
app.listen(3000, function() { 
    console.log('server uppe');
});

// middleware för mappen static så klienten kan ladda filerna
app.use('/', express.static(__dirname + '/static')); 

// moddleware för att servern skall kunna ta emot från klienten
app.use(express.urlencoded({extended : true})); 

// !!här ska det vara middleware för att hantera kakor!!
app.use(cookieParser());

// endpoint för get '/'
app.get('/', function(request, response) {

response.sendFile(__dirname + '/static/html/loggain.html', function(err) {

});

});

// end-point för get '/reset'
app.get('/reset', function(request, response){
    
});

// end-poin för post '/'
app.post('/', function(request, response) {

    let nick_1 = request.body.nick_1; // hämtar namnet som användaren skickar
    let color_1 = request.body.color_1; // hämtar färgkoden användaren skickar

    try {
        // om nick_1 är undefined
        if(nick_1 === undefined) {
            throw 'Nickname saknas!';
        }
        // om color_1 är undefined
        if(color_1 === undefined) {
            throw 'Färg saknas!';
        }
        // trimmar nick_1 och color_1 för att ta bort mellanslag
        nick_1 = nick_1.trim();
        color_1 = color_1.trim();
        
        // om nick_1 är mindre än tre tecken
        if(nick_1.length < 3) {
            throw 'Nickname skall vara tre tecken långt!';
        }
        // om color_1 inte är 7 tecken
        if(!color_1.length === 7) {
            throw 'Färg skall innehålla sju tecken!';
        }
        // om color_1 har förbjudna färger
        if(color_1 === '#ffffff' || color_1 === '#000000') {
            throw 'Ogiltig färg!';
        }
        // om spelarnas namn är likadana
        if(globalObject.playerOneNick === globalObject.playerTwoNick) {
            throw 'Nickname redan taget!';
        }
        // om spelarna färg är likadana
        if(globalObject.playerOneColor === globalObject.playerTwoColor) {
            throw 'Färg redan tagen!';
        }
        // !!!här går allt bra och vi skall skapa kakor!!!
        // nästa föreläsning!
        response.cookie('nickName', nick_1, {maxAge : 60 * 60 * 2000, httpOnly : true});
        response.cookie('color', color_1, {maxAge : 60 * 60 * 2000, httpOnly : true});

        response.redirect('/');


    } catch (errMsg) {
        
        fs.readFile(__dirname + '/static/html/loggain.html' , function(err, data){ //läser in loggain.html och tar två parametrar, err och data.
            if(errMsg){ //om errMsg är true så ska det inom if satsen hända.
                const dom = new jsDom.JSDOM(data); //skapar en jsDOM för att skapa html element och kunna modifiera domen från server sidan.
                const errorMsgDiv = dom.window.document.querySelector('#errorMsg'); //konstant för div elementet som har errorMsg som id.
                const errorMsg = dom.window.document.createTextNode(errMsg); //en konstant som innehåller en textnode med värdet från errMsg.
                errorMsgDiv.appendChild(errorMsg); //sätter errorMsg som barn till div.

                const formNick = dom.window.document.querySelector('#nick_1');
                const formColor = dom.window.document.querySelector('#color_1');

                formNick.textContent = nick_1;
                formColor.textContent = color_1;

                response.send(dom.serialize()); //skickar det modifierade html dokumentet till till klienten efter anrop. serialize() metoden används för att göra om innehållet till en sträng.
            }
        })
    }




});
