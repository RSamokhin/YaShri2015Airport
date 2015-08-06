var server= require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();
var co = require('co');
var serveStatic = require('koa-serve-static');



var proxy = require('./controllers/proxy');
app.use(route.get('/api/proxy/:method', proxy.requestData));
app.use(serveStatic('../web/build/'));
app.listen(1337);


