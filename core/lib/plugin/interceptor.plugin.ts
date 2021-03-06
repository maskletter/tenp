import tenp from '../../interface'

/**
 * Tenp interceptor implementation
 */
export default class InterceptorPlugin implements tenp.Plugin {

	private globalInterceptor: Function[] = [];

	private routerInterceptor: Function[] = [];

	public onTenp(config: tenp.StartInterface): void {
		this.globalInterceptor = config.interceptor || [];
	}

	public onRouter($class: any, routerConfig: tenp.RouterConfig, parentConfig: tenp.RouterConfig): void {
		const interceptorType: string = routerConfig.interceptorType;
		if(!interceptorType || interceptorType == 'inherit' || interceptorType == 'abandon-global'){
			//Drop global interceptor, keep router interceptor
			if(interceptorType == 'abandon-global'){
				this.globalInterceptor = [];
			}
			this.routerInterceptor = [ ...(parentConfig.interceptor || []), ...(routerConfig.interceptor||[]) ];
		}else if(interceptorType == 'abandon-router'){
			//Discard the router interceptor, but keep the global interceptor
			this.routerInterceptor = routerConfig.interceptor||[];
		}else if(interceptorType == 'abandon'){
			//Discard all interceptors
			this.globalInterceptor = [];
			this.routerInterceptor = routerConfig.interceptor||[];
		}
	}

	public onInit(pathConfig: tenp.PathConfig): void {
		const interceptorType: string = pathConfig.interceptorType;
		if(!interceptorType || interceptorType == 'inherit'){
			//Inherit all interceptors
			pathConfig.interceptor = [ ...this.globalInterceptor, ...this.routerInterceptor, ...(pathConfig.interceptor||[]) ]
		}else if(interceptorType == 'abandon-global'){
			//Drop global interceptor, keep router interceptor
			pathConfig.interceptor = [ ...this.routerInterceptor, ...(pathConfig.interceptor||[]) ]
		}else if(interceptorType == 'abandon-router'){
			//Discard the router interceptor, but keep the global interceptor
			pathConfig.interceptor = [ ...this.globalInterceptor, ...(pathConfig.interceptor||[]) ]
		}else if(interceptorType == 'abandon'){
			//Discard all interceptors
			pathConfig.interceptor = pathConfig.interceptor || [];
		}
	}

	public async onAfter(pathConfig: tenp.PathConfig, config: tenp.StartInterface, request: tenp.Request, response: tenp.Response): Promise<any> {
		let result: boolean = true;
		 for(let interceptor of pathConfig.interceptor){
			const _res = await interceptor(request, response);
			if(_res == false){
				result = false
				break;
			}
		}
		return result;
	}

}