
import * as https from 'https';
import * as http from 'http';
import express, { serveStatic } from './express';
import { Application, Response, Request } from 'express'
import { dbRouterInfo } from './router'
import tenp, {  NewFunction } from '../interface'
import { InitPluginTenpEvent, InitPluginRouterEvent, GetParentConfig, InitPluginInterfaceEvent, AfterPluginInterfaceEvent } from './event'

//Create an express service
function createExpressServer(config: tenp.StartInterface): any{
	const app = express({});
	if(config.static){
		app.use(serveStatic(config.static))
	}
	const httpServer = http.createServer(app).listen(config.port);
	if(config.https){
		const httpsServer = https.createServer(config.https, app).listen(config.port);
	}
	return app;
}

//Create an router service
async function createRouterServer(config: tenp.StartInterface, routerMap: NewFunction[], app: Application){

	for(let Class of routerMap){
		const Router = (Class as any).class ? (Class as any).class : Class;
		let classInfo = dbRouterInfo[Router.prototype.$$id]

		const $class = new classInfo.functoin();
		//Run the router initialization event
		await InitPluginRouterEvent(config, $class, classInfo.config, GetParentConfig(Router.prototype.$$parentId));
		$class.onInit && await $class.onInit();
		//Run createInterfaceServer
		await createInterfaceServer(config, classInfo, $class, app);
		if(classInfo.config.router){
			await createRouterServer(config, <any>classInfo.config.router, app)
		}
	}
}

//Create an interface service
async function createInterfaceServer(config: tenp.StartInterface, classInfo: tenp.RouterInfo, $class: Function, app: any): Promise<any> {
 	const pathMap: tenp.PathInfo[] = classInfo.path || [];
 	pathMap.forEach(async (data: tenp.PathInfo) => {
 		await InitPluginInterfaceEvent(data.config, config);
 		//Register for an express interface event
 		app[data.config.type](data.config.url, async function(request: tenp.Request, response: tenp.Response){
 			const result = await AfterPluginInterfaceEvent(data.config, config, request, response);
 			if(result != false){
 				data.callback.apply($class,[request, response])
 			}
 		})
 	})
}

export default async (config: tenp.StartInterface, app?: Application): Promise<any> => {

	if(!app){
		app = createExpressServer(config);
	}

	config.express && config.express(app);
	
	config.plugin = await InitPluginTenpEvent(config);

	await createRouterServer(config, (config.router as NewFunction[] || []), app);

	return app;

}