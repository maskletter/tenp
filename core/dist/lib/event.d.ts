import { StartInterface, RouterConfig, PathConfig, Request, Response } from '../d.ts/interface';
export declare const GetParentConfig: (parentId: string) => StartInterface;
export declare const InitPluginTenpEvent: (config: StartInterface) => any;
export declare const InitPluginRouterEvent: (config: StartInterface, $class: any, routerConfig: RouterConfig, parentConfig: RouterConfig) => any;
export declare const InitPluginInterfaceEvent: (pathConfig: PathConfig, config: StartInterface) => Promise<any>;
export declare const AfterPluginInterfaceEvent: (pathConfig: PathConfig, config: StartInterface, request: Request, response: Response) => Promise<any>;
