/// <reference types="node" />
import { Request as ExpressRequest, Response as ExpressResponse, Application } from 'express';
import { Validator } from './lib/plugin/validator.plugin';
export declare interface NewFunction {
    new (...args: any[]): any;
}
export declare type RouterParameter = Array<Function | {
    class: Function;
    data?: any;
}>;
export declare class tenp {
}
export declare namespace tenp {
    interface Request extends ExpressRequest {
    }
    interface Response extends ExpressResponse {
    }
    interface StartInterface {
        port: number;
        baseUrl?: string;
        https?: {
            key: Buffer;
            cert: Buffer;
            port: number;
        };
        global?: Object;
        static?: string;
        router?: RouterParameter;
        plugin?: Array<Function>;
        express?(app: Application): void;
        interceptor?: Array<Function>;
        provide?: Array<{
            class: Function;
            name: string;
            data?: any;
        }>;
        receive?: Function;
    }
    interface RouterInfo {
        id: string;
        name: string;
        functoin: NewFunction;
        path: PathInfo[];
        config: any;
    }
    interface PathInfo {
        config: ConfigInterface;
        callback: Function;
    }
    interface RouterConfig {
        name?: string;
        url?: string;
        router?: RouterParameter;
        interceptor?: Array<Function>;
        interceptorType?: 'inherit' | 'abandon-router' | 'abandon-global' | 'abandon';
        provide?: Array<{
            class: Function;
            name: string;
            data?: any;
        }>;
    }
    interface PathConfig {
        name?: string;
        url: string;
        interceptor?: Array<Function>;
        interceptorType?: 'inherit' | 'abandon-router' | 'abandon-global' | 'abandon';
        receive?: Function;
        validatorType?: 'query' | 'body' | 'params' | 'all';
        validator?: Validator;
    }
    interface ConfigInterface extends PathConfig {
        type?: string;
    }
    interface GetInterface extends PathConfig {
    }
    interface PostInterface extends PathConfig {
    }
    interface PutInterface extends PathConfig {
    }
    interface HeadInterface extends PathConfig {
    }
    interface DeleteInterface extends PathConfig {
    }
    interface Plugin {
        onTenp?(config?: StartInterface): void;
        onRouter?($class: any, routerConfig?: RouterConfig, parentConfig?: RouterConfig, config?: StartInterface): void;
        onInit?(pathConfig?: PathConfig, config?: StartInterface): void;
        onAfter?(pathConfig?: PathConfig, config?: StartInterface, request?: Request, response?: Response): void;
        [prop: string]: any;
    }
}
export default tenp;
