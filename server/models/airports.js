module.exports = function () {
    var Airports = require('../data/airports.json').airports;
    Airports = Airports.map(function (port) {
        return {
            code: port.fs,
            name: port.name,
            city: port.city,
            country: port.countryName,
            localTime: port.localTime
        };
    });
    return Airports;
};