import tenp from '../interface'
import UrlPlugin from './plugin/url.plugin'
import InterceptorPlugin from './plugin/interceptor.plugin'
import InjectorPlugin from './plugin/injector.plugin'
import ReceivePlugin from './plugin/receive.plugin'
import ValidatorPlugin from './plugin/validator.plugin'
import CommonPlugin from './plugin/common.plugin'
import { dbRouterInfo } from './router'

//Get the parent configuration
export const GetParentConfig: (parentId: string) => tenp.StartInterface = (parentId: string): any => {

	if(parentId && dbRouterInfo[parentId]){
		return dbRouterInfo[parentId].config
	}else{
		return {};
	}

}


//Initialize the tenp event(plugin)
export const InitPluginTenpEvent: (config: tenp.StartInterface) => any = async (config: tenp.StartInterface): Promise<any> => {

	let pluginMap = [CommonPlugin, UrlPlugin, InterceptorPlugin, InjectorPlugin, ReceivePlugin, ValidatorPlugin, ...(config.plugin || [])];
	let pluginS: any[] = [];
	for(let Plugin of pluginMap){
		let plugin: any = new (Plugin as any)();
		plugin.onTenp && await plugin.onTenp(config);
		pluginS.push(plugin)
	}

	return pluginS;
}

//Initialize routing events(plugin)
export const InitPluginRouterEvent: (config: tenp.StartInterface, $class: any, routerConfig: tenp.RouterConfig, parentConfig: tenp.RouterConfig) => any = async (config: tenp.StartInterface, $class: any, routerConfig: tenp.RouterConfig, parentConfig: tenp.RouterConfig): Promise<any> => {
	for(let plugin of config.plugin){
		(plugin as any).onRouter && await (plugin as any).onRouter($class, routerConfig, parentConfig, config);
	}
}


//Initialize interface events(plugin)
export const InitPluginInterfaceEvent: (pathConfig: tenp.PathConfig, config: tenp.StartInterface) => Promise<any> = async (pathConfig: tenp.PathConfig, config: tenp.StartInterface): Promise<any> => {
	for(let plugin of config.plugin){
		(plugin as any).onInit && await (plugin as any).onInit(pathConfig, config);
	}
}

//(plugin)
export const AfterPluginInterfaceEvent: (pathConfig: tenp.PathConfig, config: tenp.StartInterface, request: tenp.Request, response: tenp.Response) => Promise<any> = async (pathConfig: tenp.PathConfig, config: tenp.StartInterface, request: tenp.Request, response: tenp.Response): Promise<any> => {
	
	
	for(let plugin of config.plugin){
		if((plugin as any).onAfter){
			const result: boolean = await (plugin as any).onAfter(pathConfig, config, request, response)
			if(result == false){
				return false;
				break;
			}
		}
	}
	
}