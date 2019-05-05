import tenp from '../../interface';
/**
 * Tenp interceptor implementation
 */
export default class InterceptorPlugin implements tenp.Plugin {
    private globalInterceptor;
    private routerInterceptor;
    onTenp(config: tenp.StartInterface): void;
    onRouter($class: any, routerConfig: tenp.RouterConfig, parentConfig: tenp.RouterConfig): void;
    onInit(pathConfig: tenp.PathConfig): void;
    onAfter(pathConfig: tenp.PathConfig, config: tenp.StartInterface, request: tenp.Request, response: tenp.Response): Promise<any>;
}
