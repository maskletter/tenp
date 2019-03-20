import { StartInterface, RouterConfig, PathConfig, Request, Response } from '../d.ts/interface';
export declare const GetParentConfig: (parentId: string) => StartInterface;
export declare const InitTenpEvent: (config: StartInterface) => any;
export declare const InitRouterEvent: (config: StartInterface, routerConfig: RouterConfig, parentConfig: RouterConfig) => any;
export declare const InitInterfaceEvent: (pathConfig: PathConfig, config: StartInterface) => Promise<any>;
export declare const AfterInterfaceEvent: (pathConfig: PathConfig, config: StartInterface, request: Request, response: Response) => Promise<any>;
