
import * as crypto from 'crypto';
import { 
	NewFunction } from '../interface'
import tenp from '../interface'

//Store routing information
export let dbRouterInfo: { [prop: string]: tenp.RouterInfo } = {};
export let dbPathInfo: tenp.PathInfo[] = [];

//Routing entry
export const Router: (config?: tenp.RouterConfig) => any = (config: tenp.RouterConfig = {}): any => {

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
export const Config: (config: tenp.ConfigInterface) => any = (config: tenp.ConfigInterface): any => {

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
export const Get: (config: string | tenp.GetInterface) => any = (config: string | tenp.GetInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'get',  config);
	}
}
export const Post: (config: string | tenp.PostInterface) => any = (config: string | tenp.PostInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'post',  config);	
	}
}
export const Head: (config: string | tenp.HeadInterface) => any = (config: string | tenp.HeadInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'head',  config);
	}
}
export const Delete: (config: string | tenp.DeleteInterface) => any = (config: string | tenp.DeleteInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'delete',  config);
	}
}
export const Put: (config: string | tenp.PutInterface) => any = (config: string | tenp.PutInterface): any => {
	return (target: any, propertyKey: string) => {
		forwardMethod(target, propertyKey, 'put',  config);
	}
}