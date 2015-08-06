var request = require('sync-request');

module.exports.requestData = function * (method) {
    var self = this,
        url = 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/QF/1/dep/2013/08/22?appId=';

    var res = request('GET', url);

    this.body = JSON.parse(res.getBody('utf8'));
};