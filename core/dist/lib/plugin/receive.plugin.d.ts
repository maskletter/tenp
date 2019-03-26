import { Plugin, PathConfig, StartInterface, Request, Response } from '../../d.ts/interface';
/**
 * User parsed string format
 * @type {[type]} -> name=1234596
 */
export declare const parse: (data: string) => Object;
export default class ReceivePlugin implements Plugin {
    constructor(argument: any);
    private globalReceive;
    private defaultReceive;
    onTenp(config: StartInterface): void;
    onAfter(pathConfig?: PathConfig, config?: StartInterface, request?: Request, response?: Response): Promise<any>;
}
