var server= require('koa-static'),
    route = require('koa-route'),
    koa = require('koa'),
    path = require('path'),
    app = module.exports = koa(),
    co = require('co'),
    serveStatic = require('koa-serve-static'),
    proxy = require('./controllers/proxy');

app.use(route.get('/api/proxy/:method', proxy.requestData));
app.use(serveStatic('../web/build/'));
app.listen(3333);


