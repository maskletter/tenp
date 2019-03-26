import { dbRouterInfo, Router, Config, Get, Post, Delete, Put, Head } from './lib/router';
import Start from './lib/server';
export { Injector } from './lib/plugin/injector.plugin';
export { Validator, ValidatorError } from './lib/plugin/validator.plugin';
export { Controller, createController } from './lib/consoller';
export { Global, getGlobal } from './lib/plugin/common.plugin';
export { RouterConfig, ConfigInterface, RouterInfo, PathInfo, StartInterface, GetInterface, PostInterface, DeleteInterface, PutInterface, HeadInterface, Request, Response } from './d.ts/interface';
declare function tenp(): void;
export declare class RouterComponent {
    $$id: string;
    $$parentId: string;
}
export { Start, Router, Config, Get, Post, Delete, Put, Head, dbRouterInfo };
export default tenp;
