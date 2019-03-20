import { RouterConfig, ConfigInterface, RouterInfo, PathInfo, GetInterface, PostInterface, DeleteInterface, PutInterface, HeadInterface } from '../d.ts/interface';
export declare let dbRouterInfo: {
    [prop: string]: RouterInfo;
};
export declare let dbPathInfo: PathInfo[];
export declare const Router: (config?: RouterConfig) => any;
export declare const Config: (config: ConfigInterface) => any;
export declare const Get: (config: string | GetInterface) => any;
export declare const Post: (config: string | PostInterface) => any;
export declare const Head: (config: string | HeadInterface) => any;
export declare const Delete: (config: string | DeleteInterface) => any;
export declare const Put: (config: string | PutInterface) => any;
