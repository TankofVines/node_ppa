var http = require('http');
var parse = require('url').parse;
var qs = require('querystring');
var sylvester = require('sylvester');
var async = require('async');

function nndist(query, res, callback) {
    var coords = JSON.parse(query.coordinates);
    var darray = [];
    var nnvalue = 0;
    
    // // Synchronous Javascript version of the distance array constructor for reference
    // // Could be moved over to client-side if needed
    // for (i=0; i<coords.length; i++) {
        // darray.push([]);
        // for (j=0; j<coords.length; j++) {
//             
            // // Distance formula
            // dist = Math.sqrt( Math.pow( coords[j][0] - coords[i][0], 2) + Math.pow( coords[j][1] - coords[i][1], 2) )
//             
            // // Seems that the verdict is still out on what is faster
            // // In V8 it doesn't seem to matter, but some preference to push()
            // darray[i].push(dist);
        // }
    // }
    
    // async package version using forEachSeries for serial flow control
    // To do: Test speed difference between this and recursive functions
    // async.forEachSeries(coords, function(coord, callback) {
        // row = [];
        // async.forEachSeries(coords, function(neighbor, cb) {
            // // Distance formula
            // dist = Math.sqrt( Math.pow( neighbor[0] - coord[0], 2) + Math.pow( neighbor[1] - coord[1], 2) );
            // // Seems that the verdict is still out on what is faster
            // // In V8 it doesn't seem to matter, but some preference to push()
            // row.push(dist);
            // cb();
        // }, function(err) {
            // if (err) {
                // console.log(err);
            // }
        // });
        // darray.push(row);
        // callback();
        // }, function(err) {
            // if (err) {
                // console.log(err);
            // }
    // });
    
    function rowBuilder(i) {
        if(i<coords.length) {
            darray.push([]);
            function distCalc(j) {
                if(j<coords.length) {
                    // Distance formula
                    dist = Math.sqrt( Math.pow( coords[j][0] - coords[i][0], 2) + Math.pow( coords[j][1] - coords[i][1], 2) );
                    
                    // Seems that the verdict is still out on what is faster
                    // In V8 it doesn't seem to matter, but some preference to push()
                    darray[i].push(dist);
                    distCalc(j+1);
                } else {
                    rowBuilder(i+1);
                }
            }
            distCalc(0);
        } else {
            var nnarray = [];
        
            function rowSorter(i) {
                if(i<darray.length) {
                    // Array.min = function( array ){
                        // return Math.min.apply( Math, array );
                    // };
                    ascendingrow = darray.sort(function(a,b){return a - b});
                    nndist = parseFloat(ascendingrow[1]);
                    nnarray.push(nndist);
                    rowSorter(i+1);
                } else {
                    var nndistsum = 0;
                    function meanDist(j) {
                        if(j<nnarray.length) {
                            nndistsum += nnarray[j];
                            meanDist(j+1);
                        } else {
                            nnvalue = nndistsum / nnarray.length;
                        }
                    }
                    meanDist(0);
                }
            }
            rowSorter(0);
        }
    }
    rowBuilder(0);
    
    var responseobjstring = JSON.stringify(nnvalue);
    res.setHeader('Content-Type', 'application/json');
    res.end(callback + '(' + responseobjstring + ')');
    
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