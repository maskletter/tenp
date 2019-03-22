import { Request, Response } from '../d.ts/interface';
export declare const Controller: (name: string, $this?: any, argument?: any) => any;
export declare const createController: (name: string, callback: (request: Request, response: Response) => any) => any;
