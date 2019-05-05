
import tenp from '../../interface'

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
	public onTenp(config: tenp.StartInterface): void {
		// console.log(config)
		if(config.baseUrl){
			this.baseUrl = config.baseUrl;
		// console.log('pathConfig.urlpathConfig.urlpathConfig.urlpathConfig.urlpathConfig.urlpathConfig.url')
		}
	}

	//Triggered when the router initializes
	public onRouter($class: any, routerConfig: tenp.RouterConfig, parentConfig: tenp.RouterConfig, config: tenp.StartInterface): void {
		this.routerUrl = routerConfig.url = (parentConfig.url||'')+(routerConfig.url||'');
	}

	//Trigger when interface is initialized
	public onInit(pathConfig: tenp.PathConfig): void {
		pathConfig.url = this.baseUrl + this.routerUrl + pathConfig.url
	}

}