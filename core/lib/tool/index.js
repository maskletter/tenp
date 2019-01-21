"use strict";

module.exports = {


	transArray: function(event){
		if(!event) return [];
		return typeof(event) == 'function' ? [event] : event;
	}

	
}