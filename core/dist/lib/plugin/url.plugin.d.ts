import tenp from '../../interface';
/**
 * Used to implement path inheritance between routers
 */
export default class UrlPlugin {
    constructor();
    private baseUrl;
    private routerUrl;
    onTenp(config: tenp.StartInterface): void;
    onRouter($class: any, routerConfig: tenp.RouterConfig, parentConfig: tenp.RouterConfig, config: tenp.StartInterface): void;
    onInit(pathConfig: tenp.PathConfig): void;
}
