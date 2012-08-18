var http = require('http');
var parse = require('url').parse;
var qs = require('querystring');
var sylvester = require('sylvester');

function nndist(query, res, callback) {
    // coords = query.coordinates;
    // distance = [];
//     
    // for (i=0; i<coords.length; i++) {
        // distance.push([]);
        // for (j=0; j<coords.length; j++) {
//             
            // // Distance formula
            // currentDistance = Math.sqrt( Math.pow( coords[j][0] - coords[i][0], 2) + Math.pow( coords[j][1] - coords[i][1], 2) )
//             
            // // Seems that the verdict is still out on what is faster
            // // In V8 it doesn't seem to matter, but some preference to push()
            // distance[i].push(currentDistance);
        // }
    // }
}

var server = http.createServer(function(req, res) {
    
    var url = parse(req.url);
    console.log(url);
    
    var query = qs.parse(url.query);
    var callback = query.callback;
    console.log(callback);
    
    delete query.callback;
    delete query._;
    console.log(query);
    
    switch (url.pathname) {
        case '/nndist':
            console.log('doing nndist()...');
            nndist(query, res, callback);
            break;
    }
});

server.listen(3000);