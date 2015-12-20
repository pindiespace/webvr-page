/*
 * basic ExpressJS server
 * @link http://expressjs.com/starter/static-files.html
 */

//requires
var favicon = require('serve-favicon');
var express = require('express');
var path = require('path');

//make our app.
var app = express();

// Favicons.
app.use(favicon(path.join(__dirname, 'img', 'favicon.ico')));
// Use dev directories.
app.use(express.static('lib'));
app.use(express.static('build'));

// Get home page.
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

// Dev directories for testing.
app.get('/img/*', function(req, res) {
	res.sendFile(path.join(__dirname + req.path));
});

app.get('/css/*', function(req, res) {
	res.sendFile(path.join(__dirname + req.path));
});

app.get('/js/*', function(req, res) {
	res.sendFile(path.join(__dirname + req.path));
});

app.get('/test/*', function(req, res) {
	res.sendFile(path.join(__dirname + req.path));
});

/*
//get anything
app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname + req.path));
});
*/

// Start serving.
console.log('server listening at port 3000');
app.listen(3000);
