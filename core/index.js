"use strict";

const tenp = require('./lib/main.js');
const { Router: Router2, config: config2, createController, controller } = require('./lib/router')


function ObjectFind(data, name){
	let map = [];
	for(let key in data){
		if(data.hasOwnProperty(key)){
			if(name(data[key])){
				map.push(data[key])
			}
		}
	}
	return map;
}

//不做任何使用，仅用于router>class继承方法提示
module.exports = function(){};
module.exports.default = function(){};

module.exports.Main = tenp;
module.exports.createController = createController;
module.exports.controller = controller;
module.exports.Router2 = Router2;
module.exports.Router = Router2;
module.exports.config = config2;
module.exports.Global = function(){
	return function (target, propertyKey, descriptor) {
		target[propertyKey] = '$$global'
    }
};
module.exports.data = function(){
	return function (target, propertyKey, descriptor) {
		target[propertyKey] = '$$data'
    }
}

module.exports.FindByName = function(name){
	if(!name){
		return tenp.RouterTree;
	}else{
		return ObjectFind(tenp.RouterDbId, v => v.name == name)
	}
}
module.exports.FindById = function(id){
	return tenp.RouterDbId[id]
}

module.exports.inject = require('./lib/plugin/Injectable.plugin').inject;