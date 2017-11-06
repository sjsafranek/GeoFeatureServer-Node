#!/usr/bin/env node

// database.js
var logger = require('./logger.js').logger;
var log = logger('database');
const uuidv4 = require('uuid/v4');
var turf = require('@turf/turf');
const { Pool } = require('pg');

// const connectionString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'

const pool = new Pool({
    host: 'localhost',
    user: 'gisuser',
    database: 'gisdb',
    password: 'dev',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
    // connectionString: connectionString
});

exports.insertFeature = function(uuid, datasource_id, geom, properties, callback) {
    if (!uuid) {
        uuid = uuidv4();
    }
    if (!properties) {
        properties = {};
    }
    properties.uuid = uuid;
    if (!datasource_id) {
        datasource_id = "";
    }

    var longitude = (geom.lng||geom.lon||0);
    var latitude  = (geom.lat||0);

    var sql = 'INSERT INTO features (uuid, datasource_id, geom, properties) VALUES ($1,$2,ST_MakePoint($3,$4),$5)';

    pool.query(sql, [uuid, datasource_id, longitude, latitude, properties], (err, res) => {
        callback && callback(err, res);
    });
}

function buildLayerFromQueryResults(res) {
    var features = [];
    for (var i=0; i<res.rows.length; i++) {
        res.rows[i].properties.created_at = res.rows[i].created_at;
        res.rows[i].properties.updated_at = res.rows[i].updated_at;
        res.rows[i].properties.geoid      = res.rows[i].geoid;
        features.push(
            turf.point([
                        res.rows[i].longitude,
                        res.rows[i].latitude
                    ],
                    res.rows[i].properties
                )
        );
    }
    return turf.featureCollection(features);
}

exports.fetchFeature = function(uuid, callback) {
    var sql = "SELECT ST_X(geom) as longitude, ST_Y(geom) as latitude, properties, created_at, updated_at, geoid FROM features WHERE uuid = '"+uuid+"' ORDER BY geoid DESC LIMIT 1;";
    pool.query(sql, (err, res) => {
        if (err) {
            callback && callback(err);
            return;
        }
        callback && callback(err, buildLayerFromQueryResults(res));
    });
}

exports.fetchLayer = function(datasource_id, callback) {
    var sql = "SELECT ST_X(geom) as longitude, ST_Y(geom) as latitude, properties, created_at, updated_at, geoid FROM features WHERE datasource_id = $1";
    pool.query(sql, [datasource_id], (err, res) => {
        if (err) {
            callback && callback(err);
            return;
        }
        callback && callback(err, buildLayerFromQueryResults(res));
    });
}
