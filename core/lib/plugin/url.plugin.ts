
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
		if(config.baseUrl){
			this.baseUrl = config.baseUrl;
		}
	}

	//Triggered when the router initializes
	public onRouter(routerConfig: RouterConfig, parentConfig: RouterConfig, config: StartInterface): void {
		this.routerUrl = routerConfig.url = (parentConfig.url||'')+(routerConfig.url||'');
	}

	//Trigger when interface is initialized
	public onInit(pathConfig: PathConfig): void {
		pathConfig.url = this.routerUrl + pathConfig.url
	}

}