/*jshint esversion: 6, node: true*/
'use strict';

const Confidence = require('confidence');


const criteria = {
    env: process.env.NODE_ENV
};


const config = {
    $meta: 'This file configures the Hapi Server.',
    projectName: 'Hapi server proxing call to Google Apps Script API',
    script: {
        id: '1fgV29YtkNgoA__bACMMzfX7d68tnWekEUy6ZSA-dF7bUGtAAmG2NDL7C',
        functionName: 'myFunction',
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets'
        ],
    },
    port: {
        web: {
            $filter: 'env',
            test: 9090,
            $default: 8080
        }
    }
};


const store = new Confidence.Store(config);


exports.get = function(key) {

    return store.get(key, criteria);
};


exports.meta = function(key) {

    return store.meta(key, criteria);
};
