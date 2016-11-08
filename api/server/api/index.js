/*jshint esversion: 6, node: true*/
'use strict';
const google = require('./google');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

          const message = request.query.message || 'Hello from node!';

          google(message);

          reply({ message: 'Google API called' });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'api'
};
