
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var pug = require('pug');
var multiparty = require('multiparty');
var util = require('util');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function logMessage(message) {
  
  console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '[INFO] ' + message);
  
}
function logError(message) {
  
  console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [ERROR] ' + message);
  
}
  
app.get('/', routes.index);

app.post('/upload', function (req, res, next) { 
    var form = new multiparty.Form();

    console.log('In upload');
   
    form.parse(req, function(err, fields, files) {
       res.writeHead(200, {'content-type': 'text/plain'});
       res.write('received upload:\n\n');
       res.end(util.inspect({fields: fields, files: files}));

    });

});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port: \'' + app.get('port') +'\'');
});

