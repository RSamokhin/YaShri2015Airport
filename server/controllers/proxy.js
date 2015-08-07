var request = require('sync-request'),
    models = require("../models")(),
    url = require('url'),
    parse = require('co-body');



module.exports.requestAirport = function * (method, airport) {

    /*var self = this,
        url = 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/QF/1/dep/2013/08/22?appId=';

    var res = request('GET', url);

    this.body = JSON.parse(res.getBody('utf8'));
    */
    this.body = method+airport;

};

module.exports.requestAirports = function * () {
    this.body = models.airports();
}

module.exports.requestAirportsFilter = function * (p) {
    var queryData = url.parse(this.url, true).query,
        airports = models.airports();
    Object.keys(queryData).forEach(function (param) {
        airports = airports.filter(function (el) {
            return el[param] !== undefined && ~el[param].toLowerCase().indexOf(queryData[param].toLowerCase());
        });
    });
    if (typeof p === 'string') {
        var result = {};
        airports.map(function (el) {
            var value = el[p];
            if (value !== undefined || ~Object.keys(el).indexOf(p))
                result[value] = result[value] !== undefined ?  result[value]+1 : 1;
        });
        airports = Object.keys(result).map(function (key) {
            return {
                name: key,
                count: result[key]
            }
        });
    }
    this.body = airports;
};

