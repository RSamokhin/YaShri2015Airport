var request = require('sync-request'),
    models = require("../models")(),
    url = require('url'),
    parse = require('co-body');



module.exports.requestData = function * (method) {
    /*
    var self = this,
        url = 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/QF/1/dep/2013/08/22?appId=';

    var res = request('GET', url);

    this.body = JSON.parse(res.getBody('utf8'));
*/
};

module.exports.requestAirports = function * () {
    this.body = models.airports();
}
module.exports.requestAirportsParam = function * (param) {
    var result = {};
    models.airports().forEach(function (el) {
        var value = el[param];
        if (value !== undefined)
            result[value] = result[value] !== undefined ?  result[value]+1 : 1;
    });
    this.body = result;
}

module.exports.requestAirportsFilter = function * (p) {
    var queryData = url.parse(this.url, true).query,
        airports = models.airports();
    Object.keys(queryData).forEach(function (param) {
        airports = airports.filter(function (el) {
            return ~el[param].indexOf(queryData[param]);
        });
    });
    if (typeof p === 'string') {
        var result = {};
        airports.forEach(function (el) {
            var value = el[p];
            if (value !== undefined)
                result[value] = result[value] !== undefined ?  result[value]+1 : 1;
        });
        airports = result;
    }
    this.body = airports;
};

