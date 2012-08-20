var http = require('http');
var parse = require('url').parse;
var qs = require('querystring');
var sylvester = require('sylvester');
var async = require('async');

function nndist(query, res, callback) {
    coords = JSON.parse(query.coordinates);
    distance = [];
    
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
    
    function rowBuilder(i) {
        if(i<coords.length) {
            distance.push([]);
            function distCalc(j) {
                if(j<coords.length) {
                    // Distance formula
                    currentDistance = Math.sqrt( Math.pow( coords[j][0] - coords[i][0], 2) + Math.pow( coords[j][1] - coords[i][1], 2) );
                    
                    // Seems that the verdict is still out on what is faster
                    // In V8 it doesn't seem to matter, but some preference to push()
                    distance[i].push(currentDistance);
                    distCalc(j+1);
                } else {
                    rowBuilder(i+1);
                }
            }
            distCalc(0);
        }
    }
    rowBuilder(0);
    
    // async.forEachSeries(coords, function(coord, callback) {
        // row = [];
        // async.forEachSeries(coords, function(neighbor, cb) {
            // // Distance formula
            // currentDistance = Math.sqrt( Math.pow( neighbor[0] - coord[0], 2) + Math.pow( neighbor[1] - coord[1], 2) );
            // // Seems that the verdict is still out on what is faster
            // // In V8 it doesn't seem to matter, but some preference to push()
            // row.push(currentDistance);
            // cb();
        // }, function(err) {
            // if (err) {
                // console.log(err);
            // }
        // });
        // distance.push(row);
        // callback();
        // }, function(err) {
            // if (err) {
                // console.log(err);
            // }
    // });
    
    console.log(distance);
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