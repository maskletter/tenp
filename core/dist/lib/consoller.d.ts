import tenp from '../interface';
export declare const Controller: (name: string, $this?: any, argument?: any) => any;
export declare const createController: (name: string, callback: (request: tenp.Request, response: tenp.Response) => any) => any;
