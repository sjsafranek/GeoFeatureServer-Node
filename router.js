#!/usr/bin/env node

// router.js
var express = require('express');
var database = require('./database.js');
var logger = require('./logger.js').logger;
var log = logger('router');
const uuidv4 = require('uuid/v4');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic


router.get('/layers', function (req, res) {
    log.info({
        request: {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            path: req.path,
            userAgent: req.headers['user-agent']
        }
    });
    database.fetchLayers(function(err, layers) {
        if (err) {
            return res.json({
                        status: "error",
                        error: err
                    });
        }
        res.json({
            status: "ok",
            data: layers
        });
    });
});


router.get('/layer/:datasource_id', function (req, res) {
    log.info({
        request: {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            path: req.path,
            userAgent: req.headers['user-agent']
        }
    });
    database.fetchLayer(req.params.datasource_id, function(err, lyr) {
        if (err) {
            return res.json({
                        status: "error",
                        error: err
                    });
        }
        res.json({
            status: "ok",
            data: lyr
        });
    });
});

router.get('/layer/:datasource_id/feature/:id', function (req, res) {
    log.info({
        request: {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            path: req.path,
            userAgent: req.headers['user-agent']
        }
    });
    database.fetchFeature(req.params.id, function(err, lyr) {
        if (err) {
            return res.json({
                        status: "error",
                        error: err
                    });
        }
        res.json({
            status: "ok",
            data: lyr
        });
    });
});

// TileMapService Resource
router.post('/push', function (req, res) {
    log.info({
        request: {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            path: req.path,
            userAgent: req.headers['user-agent']
        }
    });

    var uuid = uuidv4();
    var datasource_id = req.body.datasource_id;
    var geom = {
        lng: req.body.feature.geometry.coordinates[0],
        lat: req.body.feature.geometry.coordinates[1]
    };
    var properties = req.body.feature.properties;

    database.insertFeature(uuid, datasource_id, geom, properties, function(err, data){
        if (err) {
            return res.json({
                        status: "error",
                        error: err
                    });
        }
        res.json({
            status: "ok",
            data: {
                uuid: uuid
            }
        });
    });

});

// exports
exports.router = router;
