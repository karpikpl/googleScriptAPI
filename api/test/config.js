/*jshint esversion: 6, node: true*/
'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../config');


const lab = exports.lab = Lab.script();


lab.experiment('Config', () => {

    lab.test('it gets config data', (done) => {

        Code.expect(Config.get('/')).to.be.an.object();
        done();
    });


    lab.test('it gets config meta data', (done) => {

        Code.expect(Config.meta('/')).to.match(/This file configures the Hapi Server/i);
        done();
    });

    lab.test('it gets config scriptId', (done) => {

        Code.expect(Config.get('/scriptId')).to.be.a.string();
        done();
    });
});
