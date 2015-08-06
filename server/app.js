var server= require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();
var co = require('co');

var proxy = require('./controllers/proxy');
app.use(route.get('/api/proxy/:method', proxy.requestData));

app.listen(1337);
console.log('listening on port 1337');