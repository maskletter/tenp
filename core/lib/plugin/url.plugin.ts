
import { StartInterface, RouterConfig, PathConfig } from '../../d.ts/interface'

/**
 * Used to implement path inheritance between routers
 */

export default class UrlPlugin  {
	
	constructor() {
		// code...
	}

	//Storage root path
	private baseUrl: string = '';

	//Storage routing path
	private routerUrl: string = '';

	//Triggered when tenp is initialized
	public onTenp(config: StartInterface): void {
		// console.log(config)
		if(config.baseUrl){
			this.baseUrl = config.baseUrl;
		// console.log('pathConfig.urlpathConfig.urlpathConfig.urlpathConfig.urlpathConfig.urlpathConfig.url')
		}
	}

	//Triggered when the router initializes
	public onRouter($class: any, routerConfig: RouterConfig, parentConfig: RouterConfig, config: StartInterface): void {
		this.routerUrl = routerConfig.url = (parentConfig.url||'')+(routerConfig.url||'');
	}

	//Trigger when interface is initialized
	public onInit(pathConfig: PathConfig): void {
		pathConfig.url = this.baseUrl + this.routerUrl + pathConfig.url
	}

}