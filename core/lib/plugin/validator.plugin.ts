
import { Plugin, PathConfig, StartInterface, Request, Response } from '../../d.ts/interface'

export default class ValidatorPlugin implements Plugin {
	
	constructor() {
		// code...
	}

	private globalDone: Function;

	private defaultDone(data: ValidatorError, request: Request, response: Response): void {
		response.json(data)
	}

	private defaultType: { [prop: string]: RegExp } = {
		phone: /^1[34578]\d{9}$/,
		email: /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
	}

	private validator(data: any, validator: Validator, request: Request, response: Response): boolean {
		const done = validator.done ? validator.done : this.globalDone ? this.globalDone : this.defaultDone;
		let result: boolean = false;
		for(let name in validator){
			if(name == 'done') continue;
			let value: any = validator[name];
			const __d: string = data[name] || value.default || undefined;
			const message: any = value.message || {};
			if(value.required != false && __d == void 0){
				done({ name: 'required', value: __d, message: message.required }, request, response)
				result=false;break;
			}else if (value.type && this.defaultType[value.type] && !this.defaultType[value.type].test(__d)){
				done({ name: 'type', value: __d, message: message.type }, request, response)
				result=false;break;
			}else if (value.length) {
				if(value.length[1] != -1){
					if (!(__d.length < value.length[0] && __d.length > value.length[1])) {
						done({ name: 'length', value: __d, message: message.length }, request, response)
						result=false;break;
					}
				}else{
					if(__d.length < value.length[0]){
						done({ name: 'length', value: __d, message: message.length }, request, response)
						result=false;break;	
					}
				}
			}else if ( value.regular && !value.regular.test(__d) ){
				done({ name: 'regular', value: __d, message: message.regular }, request, response)	
				result=false;break;
			}else{
				result = true;
			}
		}
		return result;
	}

	private mininData(request: Request): Object{
		return Object.assign({}, request.params, request.query, request.body)
	}

	public onAfter(pathConfig: PathConfig, config: StartInterface, request: Request, response: Response): any {
		if(!pathConfig.validator) return true;
		let defaultType: string = pathConfig.validatorType || ((pathConfig as any).type=='post'?'body':'query');
		let data = {};
		if(defaultType == 'all'){
			data = this.mininData(request);
		}else{
			data = (request as any)[defaultType]
		}
		return this.validator(data, pathConfig.validator, request, response);
	}

}

export interface Validator{

	[prop: string]: {
		required?: boolean
		default?: any
		regular?: RegExp
		length?: [number, number] | [ number, -1 ]
		type?: string
		message?: {
			required?: string
			length?: string
			regular?: string
			type?: string
		}
	} | Function | undefined

	done?(data?: ValidatorError, request?: Request, response?: Response): void

}

export interface ValidatorError{
	name: string 
	value: string, 
	message: string
}