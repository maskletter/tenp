
import * as crypto from 'crypto';
import { 
	RouterConfig, 
	ConfigInterface, 
	RouterInfo,
	PathInfo, 
	NewFunction, 
	GetInterface, PostInterface, DeleteInterface, PutInterface, HeadInterface } from '../d.ts/interface'

//Store routing information
export let dbRouterInfo: { [prop: string]: RouterInfo } = {};
export let dbPathInfo: PathInfo[] = [];

//Routing entry
export const Router: (config?: RouterConfig) => any = (config: RouterConfig = {}): any => {

	return (target: NewFunction) => {
		const key: string = crypto.createHash('md5').update(Math.random()+target.name).digest('hex');
		
		//If there is a router, set the parentId for the Function in the router.
		if(config.router){
			config.router.forEach((Class: any) => {
				if(Class.data){
					Class.class.prototype.$$parentId = key;	
				}else{
					Class.prototype.$$parentId = key;	
				}
				
			})
		}

		//Create a router data structure
		dbRouterInfo[key] = {
			id: key,
			name: target.name,
			config: config,
			functoin: target,
			path: [...dbPathInfo]
		};
		dbPathInfo = [];
		target.prototype.$$id = key;
	}

}


//Interface entry
export const Config: (config: ConfigInterface) => any = (config: ConfigInterface): any => {

	//The default is the get method
	config.type || (config.type = 'get');
	//Append to the interface array
	return (target: any, propertyKey: string) => {
		dbPathInfo.push({
			config: config,
			callback: target[propertyKey]
		})
	}
	
};

function forwardMethod(target: any, propertyKey: string,method:string, config: any) {

	if(typeof(config) == 'string'){
		Config({ type: method, url: config })(target, propertyKey)
	}else{
		Config({ type: method, ...config })(target, propertyKey)
	}
}

//Simplify request method
export const Get: (config: string | GetInterface) => any = (config: string | GetInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'get',  config);
	}
}
export const Post: (config: string | PostInterface) => any = (config: string | PostInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'post',  config);	
	}
}
export const Head: (config: string | HeadInterface) => any = (config: string | HeadInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'head',  config);
	}
}
export const Delete: (config: string | DeleteInterface) => any = (config: string | DeleteInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'delete',  config);
	}
}
export const Put: (config: string | PutInterface) => any = (config: string | PutInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'put',  config);
	}
}