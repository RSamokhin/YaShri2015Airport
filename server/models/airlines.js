module.exports = function () {
    var Airlines = require('../data/airlines.json').airlines;
    Airlines = Airlines.map(function (line) {
        return {
            fs: line.fs,
            name: line.name
        };
    });
    return Airlines;
};