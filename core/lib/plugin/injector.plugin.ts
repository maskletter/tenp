import tenp, { NewFunction } from '../../interface'
import { dbRouterInfo } from '../router'
/**
 * Used to implement factory services
 */

export default class InjectorPlugin implements tenp.Plugin {

	private globalProvide: { [prop: string]: any } = {};

	public onTenp(config: tenp.StartInterface): void {
		this.globalProvide = this.initProvide(config.provide || [])
	}

	//Initialization service
	private initProvide(provide: any[]): any {
		let provideMap: any = {};
		provide.forEach((data: { class: NewFunction, name: string, data?: any }) => {
			provideMap[data.name] = new data.class(data.data || null)
		})
		return provideMap
	}

	//Step by step search service
	private searchServer(name: string,id: string): any{
		let server = null;
		const routerInfo: tenp.RouterInfo = dbRouterInfo[id];
		let pluginMap = routerInfo.config.provide;
		if(pluginMap[name]){
			server = pluginMap[name];
		}else if(!routerInfo.functoin.prototype.$$parentId){
			server = this.globalProvide[name] || null;
		}else{
			server = this.searchServer(name, routerInfo.functoin.prototype.$$parentId)
		}
		return server;
	}

	public onRouter($class: any, routerConfig: tenp.RouterConfig): void {
		routerConfig.provide = this.initProvide(routerConfig.provide || []);
		for(let key in $class){
			if(key.substr(0,13) != 'tenp_provide_')  continue;
			const name: string = key.substr(13);
			$class[$class[key]] = this.searchServer(name, $class.$$id);
			delete $class[key]
		}
	}

}

export const Injector: (name: string) => any = (name: string): any => {
	return function (target: any, propertyKey: string) {
        target[propertyKey] = {}
        target['tenp_provide_'+name] = propertyKey;
    }
}