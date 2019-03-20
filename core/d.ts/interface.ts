
import { Request as ExpressRequest, Response as ExpressResponse, Application } from 'express';

export declare interface NewFunction{
	new(...args: any[]): any 
}

export type RouterParameter = Array<Function | { class: Function, data?: any }>

export declare interface Request extends ExpressRequest{}
export declare interface Response extends ExpressResponse{}

//Service startup parameter
export declare interface StartInterface {
	port: number
	baseUrl?: string
	https?: {
		key: Buffer, 
		cert: Buffer,
		port: number,
	}
	router?: RouterParameter
	plugin?: Array<Function>
	express?(app: Application): void,
	interceptor?: Array<Function>
}

//Storage routing configuration
export declare interface RouterInfo {
	id: string,
	name: string,
	functoin: NewFunction,
	path: PathInfo[]
	config: any
}

//Storage interface configuration
export declare interface PathInfo {
	config: ConfigInterface,
	callback: Function
}

//Basic routing configuration
export declare interface RouterConfig {
	url?: string
	router?: RouterParameter
	interceptor?: Array<Function>
	interceptorType?: 'inherit' | 'abandon-router' | 'abandon-global' | 'abandon'
}


//Basic interface configuration
export declare interface PathConfig {
	url: string
	interceptor?: Array<Function>
	interceptorType?: 'inherit' | 'abandon-router' | 'abandon-global' | 'abandon'
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
	onRouter?(routerConfig?: RouterConfig, parentConfig?: RouterConfig, config?: StartInterface): void
	onInit?(pathConfig?: PathConfig, config?: StartInterface): void
	onAfter?(pathConfig?: PathConfig, config?: StartInterface, request?: Request, response?: Response): void
	[prop: string]: any
}