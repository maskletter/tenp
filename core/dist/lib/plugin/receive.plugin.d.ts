import tenp from '../../interface';
/**
 * User parsed string format
 * @type {[type]} -> name=1234596
 */
export declare const parse: (data: string) => Object;
export default class ReceivePlugin implements tenp.Plugin {
    constructor(argument: any);
    private globalReceive;
    private defaultReceive;
    onTenp(config: tenp.StartInterface): void;
    onAfter(pathConfig?: tenp.PathConfig, config?: tenp.StartInterface, request?: tenp.Request, response?: tenp.Response): Promise<any>;
}
