import { Plugin, PathConfig, StartInterface, Request, Response } from '../../d.ts/interface';
export default class ValidatorPlugin implements Plugin {
    constructor();
    private globalDone;
    private defaultDone;
    private defaultType;
    private validator;
    private mininData;
    onAfter(pathConfig: PathConfig, config: StartInterface, request: Request, response: Response): any;
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
