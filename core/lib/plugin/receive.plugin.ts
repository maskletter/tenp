
import { Plugin, PathConfig, StartInterface, Request, Response } from '../../d.ts/interface'
import * as formidable from 'formidable'

/**
 * User parsed string format
 * @type {[type]} -> name=1234596
 */
export const parse: (data: string) => Object = (data: string): Object => {
	const obj = data.split('&');
	let newData: any = {};
	for(let d of obj){
		let _d = d.split('=');
		newData[_d[0]] = _d[1];
	}
	return newData
}

export default class ReceivePlugin implements Plugin {
	
	constructor(argument: any) {
		// code...
	}

	private globalReceive: Function;

	//Default receiving rule
	private defaultReceive(request: Request): Promise<any> {
		const contentType: string = request.headers['content-type'];
		if(contentType.indexOf('multipart/form-data;') != -1){
			return new Promise((resolve, reject) => {
	            const form = new formidable.IncomingForm();

	            //去除所有文件,只保留文字内容
	            form.onPart = function(part) {
		            if (!part.filename) {
		                form.handlePart(part);
		            }
	            }

	            form.parse(request, function(err, fields, files) {
	                if(err){
	                    throw err
	                }
	                resolve(fields);
	            });
	        })
		}else{
			return new Promise((resolve, reject) => {
				let str = '';
				request.on('data', (buffer: any) => str += buffer);
				request.on('end', () => {
					try{
						// xml.send(JSON.stringify({'name': 'aaaaaaaaaaaaaa'}))
						resolve(JSON.parse(str))
					}catch(e){
						if(str.indexOf('=') != -1){
							// xml.send('name=1234596');
							resolve(parse(str))
						}else{
							// xml.send('abcdefg');
							resolve(str);
						}
					}
				})
			})
		}
			
	}

	public onTenp(config: StartInterface){
		if(config.receive){
			this.globalReceive = config.receive;
		}
	}

	public async onAfter(pathConfig?: PathConfig, config?: StartInterface, request?: Request, response?: Response): Promise<any> {

		if((pathConfig as any).type == 'post'){
			const method: Function = this.globalReceive ? this.globalReceive : pathConfig.receive ? pathConfig.receive : this.defaultReceive;
			const result = await method(request);
			request.body = result;
		}

	}


}