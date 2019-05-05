import tenp from '../interface';
export declare const GetParentConfig: (parentId: string) => tenp.StartInterface;
export declare const InitPluginTenpEvent: (config: tenp.StartInterface) => any;
export declare const InitPluginRouterEvent: (config: tenp.StartInterface, $class: any, routerConfig: tenp.RouterConfig, parentConfig: tenp.RouterConfig) => any;
export declare const InitPluginInterfaceEvent: (pathConfig: tenp.PathConfig, config: tenp.StartInterface) => Promise<any>;
export declare const AfterPluginInterfaceEvent: (pathConfig: tenp.PathConfig, config: tenp.StartInterface, request: tenp.Request, response: tenp.Response) => Promise<any>;
