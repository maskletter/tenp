import tenp from '../interface'

let controllerMap: { [prop: string]: Function } = {};

function getController(name: string): Function {
	if(!controllerMap[name]){
		console.log(`\r\n\x1B[31m error  控制器未创建\x1B[39m\r\n`)
	}
	return controllerMap[name] || function(req: tenp.Request, res: tenp.Response){
		res.send('<h1>404 not Controller</h1>')
	};
}

export const Controller: (name: string, $this?: any, argument?: any) => any = (name: string, $this?: any, argument?: any): any => {

	if($this){

	}else{
		return function (target: any, propertyKey: any) {
			const d = require('./router').dbPathInfo;
			d[d.length-1].callback = getController(name);
		}
	}

}

export const createController: (name: string, callback: (request: tenp.Request, response: tenp.Response) => any) => any = (name: string, callback: (request: tenp.Request, response: tenp.Response) => any): any => {

	controllerMap[name] = callback;

	return callback;

}