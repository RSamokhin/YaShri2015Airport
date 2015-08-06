var server= require('koa-static'),
    route = require('koa-route'),
    koa = require('koa'),
    path = require('path'),
    app = module.exports = koa(),
    co = require('co'),
    serveStatic = require('koa-serve-static'),
    proxy = require('./controllers/proxy'),
    models = require('./models');


app.use(route.get('/api/proxy/airports', proxy.requestAirports));
app.use(serveStatic('../web/build/'));

if (!module.parent)
{
    var models = require("./models");

    co(function * (){

    app.listen(3333);
});
}