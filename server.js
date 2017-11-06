#!/usr/bin/env node

// TMS Node Server - Mapnik
// =============================================================================

// vector tile server
// https://www.npmjs.com/package/tilesplash

var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var logger = require('./logger.js').logger;
log = logger('server');

// call the local packages
var router = require('./router.js').router;

var PORT = process.env.PORT || 3000;

var PROJECT = {
    name: 'GeoFeatureServer',
    major: 0,
    minor: 0,
    patch: 1,
    getVersion: function() {
        return this.name
            + '-' + this.major
            + '.' + this.minor
            + '.' + this.patch;
    }
}

const app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(PORT, function () {
    console.log('Starting', PROJECT.getVersion())
    console.log('Magic happens on port ' + PORT + '!');
    log.info('Running');
});
