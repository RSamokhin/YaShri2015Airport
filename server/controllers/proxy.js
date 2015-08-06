var parse = require('co-body'),
    https = require("https");




module.exports.requestData = function * (method) {
    var self = this;


    var request = require('sync-request');
    var res = request('GET', 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/QF/1/dep/2013/08/22?appId=');

    this.body = JSON.parse(res.getBody('utf8'));
};