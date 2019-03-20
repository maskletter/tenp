import { StartInterface, RouterConfig, PathConfig } from '../../d.ts/interface';
/**
 * Used to implement path inheritance between routers
 */
export default class UrlPlugin {
    constructor();
    private baseUrl;
    private routerUrl;
    onTenp(config: StartInterface): void;
    onRouter(routerConfig: RouterConfig, parentConfig: RouterConfig, config: StartInterface): void;
    onInit(pathConfig: PathConfig): void;
}
