var express = require("express"); // Initialisation of Express.js module for Node.js REST Calling
var app = express(); // Express variable
app.use(express.static(__dirname + '/client'));
var util = require('util');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
//     extended: true
// }));



//  Loading index.html
app.get('/', function(req, res) {
    res.sendFile('./client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});



// Start the server

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
