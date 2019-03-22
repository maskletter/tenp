import { Plugin, StartInterface, RouterConfig, PathConfig, Request, Response } from '../../d.ts/interface';
/**
 * Tenp interceptor implementation
 */
export default class InterceptorPlugin implements Plugin {
    private globalInterceptor;
    private routerInterceptor;
    onTenp(config: StartInterface): void;
    onRouter($class: any, routerConfig: RouterConfig, parentConfig: RouterConfig): void;
    onInit(pathConfig: PathConfig): void;
    onAfter(pathConfig: PathConfig, config: StartInterface, request: Request, response: Response): Promise<any>;
}
