module.exports = function () {
    var Airports = require('../data/airports.json').airports;
    Airports = Airports.map(function (port) {
        return {
            fs: port.fs,
            name: port.name,
            city: port.city,
            countryName: port.countryName,
            localTime: port.localTime
        };
    });
    return Airports;
};