"use strict";
/**
 * 拷贝自express/lib/express.js
 */
declare const require: any;
declare const exports: any;
var bodyParser = require('body-parser')
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('express/lib/application');
var Route = require('express/lib/router/route');
var Router = require('express/lib/router');
var req = require('express/lib/request');
var res = require('express/lib/response');

function CreateProtoTypeMethod(statusObject: any, plugin: any){
  for(let key in plugin){
    if(plugin.hasOwnProperty(key)){
      statusObject[key] = { configurable: true, enumerable: true, writable: true, value:plugin[key] }
    }
  }
}


/**
 * Expose `createApplication()`.
 */

export default createApplication;
// exports = module.exports = createApplication;

function expandExpress(req: any, app: any, plugin: any){
  return Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app },
    ...plugin
  })
}

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication(config: any) {

  config = Object.assign({
    plugin: []
  }, config)

  var app: any = function(req: any, res: any, next: any) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  //自定义扩充express方法
  let pluginRequst = {};
  let pluginResponse = {};
  for(let plugin of config.plugin){
    plugin = plugin;
    if(plugin.request){
      CreateProtoTypeMethod(pluginRequst, plugin.request)
    }
    if(plugin.response){
      CreateProtoTypeMethod(pluginResponse, plugin.response)
    }
  }

  // expose the prototype that will get set on requests
  app.request = expandExpress(req, app, pluginRequst)

  // expose the prototype that will get set on responses
  app.response = expandExpress(res, app, pluginResponse)


  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */
export const application = proto
export const request = req
export const response = res

/**
 * Expose constructors.
 */

export { Route, Router }

/**
 * Expose middleware
 */

export const json = bodyParser.json
export const query = require('express/lib/middleware/query');
export const serveStatic = require('serve-static');
export const urlencoded = bodyParser.urlencoded

/**
 * Replace removed middleware with an appropriate error message.
 */

var removedMiddlewares = [
  'bodyParser',
  'compress',
  'cookieSession',
  'session',
  'logger',
  'cookieParser',
  'favicon',
  'responseTime',
  'errorHandler',
  'timeout',
  'methodOverride',
  'vhost',
  'csrf',
  'directory',
  'limit',
  'multipart',
  'staticCache'
]

removedMiddlewares.forEach(function (name) {

  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
    },
    configurable: true
  });
});