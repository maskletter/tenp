
import { Request as ExpressRequest, Response as ExpressResponse, Application } from 'express';
import { Validator } from '../lib/plugin/validator.plugin'

export declare interface NewFunction{
	new(...args: any[]): any 
}

// export declare interface Router {
// 	$$id?: string
// 	$$parentId?: string
// }

export type RouterParameter = Array<Function | { class: Function, data?: any }>

export declare interface Request extends ExpressRequest{}
export declare interface Response extends ExpressResponse{}

//Service startup parameter
export declare interface StartInterface {
	port: number
	baseUrl?: string
	https?: {
		key: Buffer
		cert: Buffer
		port: number
	}
	global?: Object
	static?: string
	router?: RouterParameter
	plugin?: Array<Function>
	express?(app: Application): void
	interceptor?: Array<Function>
	provide?: Array<{ class: Function, name: string, data?: any }>
	receive?: Function
}

//Storage routing configuration
export declare interface RouterInfo {
	id: string,
	name: string,
	functoin: NewFunction
	path: PathInfo[]
	config: any
}

//Storage interface configuration
export declare interface PathInfo {
	config: ConfigInterface
	callback: Function
}

//Basic routing configuration
export declare interface RouterConfig {
	name?: string
	url?: string
	router?: RouterParameter
	interceptor?: Array<Function>
	interceptorType?: 'inherit' | 'abandon-router' | 'abandon-global' | 'abandon'
	provide?: Array<{ class: Function, name: string, data?: any }>
}


//Basic interface configuration
export declare interface PathConfig {
	name?: string
	url: string
	interceptor?: Array<Function>
	interceptorType?: 'inherit' | 'abandon-router' | 'abandon-global' | 'abandon'
	receive?: Function
	validatorType?: 'query' | 'body' | 'params' | 'all'
	validator?: Validator
}

//Config interface configuration
export declare interface ConfigInterface extends PathConfig{

	type?: string
	// type?: string[] |'get'|'post'|'put'|'head'|'delete'|'options'|'trace'|'copy'|'lock'|'mkcol'|'move'|'purge'|'propfind'|'proppatch'|'unlock'|'report'|'mkactivity'|'checkout'|'merge'|'m-search'|'notify'|'subscribe'|'unsubscribe'|'patch'|'search'|'connect'
	
}

export declare interface GetInterface extends PathConfig{
	
}
export declare interface PostInterface extends PathConfig{
	
}
export declare interface PutInterface extends PathConfig{
	
}
export declare interface HeadInterface extends PathConfig{
	
}
export declare interface DeleteInterface extends PathConfig{
	
}


export declare interface Plugin{
	onTenp?(config?: StartInterface): void
	onRouter?($class: any, routerConfig?: RouterConfig, parentConfig?: RouterConfig, config?: StartInterface): void
	onInit?(pathConfig?: PathConfig, config?: StartInterface): void
	onAfter?(pathConfig?: PathConfig, config?: StartInterface, request?: Request, response?: Response): void
	[prop: string]: any
}