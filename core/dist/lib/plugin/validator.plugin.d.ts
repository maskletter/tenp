import tenp from '../../interface';
export default class ValidatorPlugin implements tenp.Plugin {
    constructor();
    private globalDone;
    private defaultDone;
    private defaultType;
    private validator;
    private mininData;
    onAfter(pathConfig: tenp.PathConfig, config: tenp.StartInterface, request: tenp.Request, response: tenp.Response): any;
}
export interface Validator {
    [prop: string]: {
        required?: boolean;
        default?: any;
        regular?: RegExp;
        length?: [number, number] | [number, -1];
        type?: string;
        message?: {
            required?: string;
            length?: string;
            regular?: string;
            type?: string;
        };
    } | Function | undefined;
    done?(data?: ValidatorError, request?: Request, response?: Response): void;
}
export interface ValidatorError {
    name: string;
    value: string;
    message: string;
}
