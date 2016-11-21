/*jshint esversion: 6, node: true*/
'use strict';

const Composer = require('./index');


Composer((err, server) => {

    if (err) {
        throw err;
    }

    server.start(() => {

        console.log('Started hapi Google API server on port ' + server.info.port);
    });
});
