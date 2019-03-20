
import * as https from 'https';
import * as http from 'http';
import express from './express';
import { Application, Response, Request } from 'express'
import { dbRouterInfo } from './router'
import { StartInterface, RouterInfo, NewFunction, PathInfo } from '../d.ts/interface'
import { InitTenpEvent, InitRouterEvent, GetParentConfig, InitInterfaceEvent, AfterInterfaceEvent } from './event'
import InterceptorPlugin from './plugin/interceptor.plugin'

//Create an express service
function createExpressServer(config: StartInterface): any{
	const app = express({});
	const httpServer = http.createServer(app).listen(config.port);
	if(config.https){
		const httpsServer = https.createServer(config.https, app).listen(config.port);
	}
	return app;
}

//Create an router service
async function createRouterServer(config: StartInterface, routerMap: NewFunction[], app: Application){

	for(let Class of routerMap){
		const Router = (Class as any).class ? (Class as any).class : Class;
		let classInfo = dbRouterInfo[(Router as any).$$id]

		const $class = new classInfo.functoin();
		//Run the router initialization event
		await InitRouterEvent(config, classInfo.config, GetParentConfig(Router.$$parentId));
		//Run createInterfaceServer
		await createInterfaceServer(config, classInfo, $class, app);
		if(classInfo.config.router){
			await createRouterServer(config, <any>classInfo.config.router, app)
		}
	}
}

//Create an interface service
async function createInterfaceServer(config: StartInterface, classInfo: RouterInfo, $class: Function, app: any): Promise<any> {
 	const pathMap: PathInfo[] = classInfo.path || [];
 	pathMap.forEach(async (data: PathInfo) => {
 		await InitInterfaceEvent(data.config, config);
 		//Register for an express interface event
 		app[data.config.type](data.config.url, async function(request: Request, response: Response){
 			const result = await AfterInterfaceEvent(data.config, config, request, response);
 			if(result != false){
 				data.callback.apply($class,[request, response])
 			}
 		})
 	})
}

export default async (config: StartInterface, app?: Application): Promise<any> => {

	if(!app){
		app = createExpressServer(config);
	}
	
	config.plugin = await InitTenpEvent(config);

	await createRouterServer(config, (config.router as NewFunction[]), app);

	return app;

}