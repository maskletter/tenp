"use strict";

const tool = require('./tool')
const app = require('express').Router();
const express = require('express');

let RouterUrl = {};

let ControllerMap = {};

function Forward(path, config = {}){
	const data = RouterUrl[path];
	if(data){
		const method = config.method || 'get';
		if(data.method.indexOf(method) == -1){
			throw new Error('未寻找到对应路由');
		}
		this.req.query = config.query || {};
		this.req.body = config.body || {};
		TransferRouter(this.req, this, { ...data, method })
	}else{
		throw new Error('未寻找到对应路由');
	}
}

express.response.router = function(path, config){
	Forward(path, config)
}

function LoaderPlugin(request, response, config){

	return async function(){
		const pluginMap = config.$tenp.plugin;
		async function run(index){
			if(pluginMap[index]){
				if(pluginMap[index].main){
					await pluginMap[index].main(request, response, config);
				}
				index++;
				await run(index)
			}else{
				return true;
			}
		}
		await run(0)	
	}()
}

//全局错误处理
function GlobalError(request, response, config, error){
	const status = error.status || 500;
	if(config.$tenp.throw){
		config.$tenp.throw(request, response, status, error.error || error)
	}else{
		response.status(500).send(`<pre>${new Error(error).stack}</pre>`)
	}
}

//运行路由
function TransferRouter(request, response, config){

	//运行插件
	LoaderPlugin(request, response, config).then(_ => {
		const cb = config.process.apply(config.$class, [ request, response ]);
		cb && cb.catch && cb.catch(error => {
			GlobalError(request, response, config, error)
		})
	}).catch(error => {
		GlobalError(request, response, config, error)
	})

	

}

//app路由入口
module.exports = function(method, config){


	const _config = { ...config, method: [method] }
	// config.method = method;
	
	if(RouterUrl[_config.url]){
		RouterUrl[_config.url].method.push(method)
	}else{
		RouterUrl[_config.url] = _config;
	}
	
	app[method](_config.url, function(request, response){
		TransferRouter(request, response, _config)
	})
}

module.exports.Forward = Forward;
module.exports.appRouter = app;
module.exports.RouterUrl = RouterUrl;
module.exports.createController = function(name, callback){
	if(ControllerMap[name]){
		console.log(`\r\n\x1B[31m error  控制器已存在\x1B[39m\r\n`)
	}else{
		ControllerMap[name] = callback;
		return callback
	}
}
const getController = module.exports.getController = function(name, callback){
	if(!ControllerMap[name]){
		console.log(`\r\n\x1B[31m error  控制器未创建\x1B[39m\r\n`)
	}
	return ControllerMap[name] || function(req, res){
		res.send('<h1>404 not Controller</h1>')
	};
}

// @Controller
module.exports.Controller = function(name){
	return function(target, propertyKey){
		let $status = target.$$childConfig[target.$$childConfig.length-1];
		$status.process = getController(name)
	}
}

//@Router
module.exports.Router  = function(config){
	return function(target, propertyKey){
		target.prototype.$$config = config || {};
		target.prototype.$$config.interceptor = tool.transArray(target.prototype.$$config.interceptor)
	}
}

const setUrlConfig = function(target, propertyKey, config, method){
	if(!target.$$childConfig){
		target.$$childConfig = [];
	}
	
	delete config.type;
	target.$$childConfig.push({
		method: method,
		...config,
		process: config.controller ? getController(config.controller) : target[propertyKey]
	})
}

for(let data of ['Get','Post','Head','Put','Delete']){
	module.exports[data] = function(config){
		return function(target, propertyKey){
			config = typeof(config) == 'string' ? { url: config } : config;
			setUrlConfig(target, propertyKey, config, [data.toLocaleLowerCase()])
		}
	}
}

//@config
module.exports.config = function(config){
	return function(target, propertyKey){
		let method = function(){
			if(typeof(config.type) == 'string'){
				return [config.type.toLocaleLowerCase()]
			}else{
				return config.type.map(v => v.toLocaleLowerCase())
			}
		}();
		setUrlConfig(target, propertyKey, config, method)
	}
}