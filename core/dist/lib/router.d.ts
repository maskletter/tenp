import tenp from '../interface';
export declare let dbRouterInfo: {
    [prop: string]: tenp.RouterInfo;
};
export declare let dbPathInfo: tenp.PathInfo[];
export declare const Router: (config?: tenp.RouterConfig) => any;
export declare const Config: (config: tenp.ConfigInterface) => any;
export declare const Get: (config: string | tenp.GetInterface) => any;
export declare const Post: (config: string | tenp.PostInterface) => any;
export declare const Head: (config: string | tenp.HeadInterface) => any;
export declare const Delete: (config: string | tenp.DeleteInterface) => any;
export declare const Put: (config: string | tenp.PutInterface) => any;
