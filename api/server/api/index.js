/*jshint esversion: 6, node: true*/
'use strict';
const Google = require('./google');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            const message = request.query.message || 'Hello from node!';
            Google(message, (err, res) => {

                if (err) {
                    return reply(err);
                }

                reply(res);
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'api'
};
