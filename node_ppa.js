var http = require('http');
var parse = require('url').parse;
var qs = require('querystring');
var sylvester = require('sylvester');

function nndist(req, res, callback) {
    // sylvester stuff
}

var server = http.createServer(function(req, res) {
    
    var url = parse(req.url);
    console.log(url);
    
    var query = qs.parse(url.query);
    console.log(query);
    var callback = query.callback;
    query.begin = +(query.begin);
    query.through = +(query.through);
    console.log(callback);
    
    delete query.callback;
    delete query._;
    console.log(query);
    
    switch (url.pathname) {
        case '/nndist':
            console.log('doing nndist()...');
            nndist(req, res, callback);
            break;
    }
});

server.listen(3000);