var fs = require('fs');
var path = require('path');

module.exports = function () {
    var model = {};
    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.indexOf('.js') !== -1);
        })
        .forEach(function(file) {
            model[file.replace('.js', '')] = require('./' + file);
        });
    return model;
};
