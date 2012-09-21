var http = require('http');
var parse = require('url').parse;
var qs = require('querystring');
var sylvester = require('sylvester');
var async = require('async');

// Nearest neighbor distance calculator function
// Takes the coordinates array from the query and build a D matrix
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
    
    // The row builder function creates a new row of values in the D matrix
    // It is called recursively until the coordinates array is traversed
    // Once all the coordinates have been iterated over a new array is used
    // to 
    function rowBuilder(i) {
        if(i<coords.length) {
            darray.push([]);
            
            // The distance calculation function calculates the distance between the current point/row (i)
            // and every other point (j) then pushed that value into the current row and traverses the row recursively
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
            
            // The row sorter function iterates of the D matrix rows and sorts them in ascending order
            function rowSorter(i) {
                if(i<darray.length) {
                    // Array.min = function( array ){
                        // return Math.min.apply( Math, array );
                    // };
                    ascendingrow = darray.sort(function(a,b){return a - b});
                    currentdist = parseFloat(ascendingrow[1]);
                    nnarray.push(currentdist);
                    rowSorter(i+1);
                } else {
                    var nndistsum = 0;
                    
                    // Iterates over the sorted rows and adds the value of shortest distance to the running total
                    function meanDist(j) {
                        if(j<nnarray.length) {
                            nndistsum += nnarray[j];
                            meanDist(j+1);
                        } else {
                            nnvalue = Math.round(nndistsum / nnarray.length);
                        }
                    }
                    meanDist(0);
                }
            }
            rowSorter(0);
        }
    }
    rowBuilder(0);
    
    // Respond with the stringified nearest neighbor value
    var responseobjstring = JSON.stringify(nnvalue);
    res.setHeader('Content-Type', 'application/json');
    res.end(callback + '(' + responseobjstring + ')');
}

// Create a server and parse the url, query string, and callback
// Switch to direct incoming request to functions
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