
const formidable = require('formidable');

/**
 * 存储公共js变量
 */

//Global
module.exports = {

	//默认post解析器
	DEFAULT_VALIDATION: function(req, next){
		const form = new formidable.IncomingForm();

		//去除所有文件,只保留文字内容
		form.onPart = function(part) {
		  if (!part.filename) {
		    form.handlePart(part);
		  }
		}

		form.parse(req, function(err, fields, files) {
			if(err){
				throw err
			}
	      	next(fields);
	    });
	},

	//全局数据类型
	ValidationType: {
		phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
		number: /^[0-9]*$/,
		required: /\S/
	},
	ValidationDone: function(err, response){
		response.json({ code: 0, msg: err })
	},
	ValidationTemplate: {
		empty: '${name}不能为空',
		regular: '${name}格式不正确'
	},

	//全局throw方法
	THROW: null,
	//默认使class内方法的this对象执行当前class
	useThis: true,

	interceptor: [],

	loader: [],

	upload: undefined,

	$set: function(name, value){
		this[name] = value;
	},


	transArray: function(event){
		if(!event) return [];
		return typeof(event) == 'function' ? [event] : event;
	}

}