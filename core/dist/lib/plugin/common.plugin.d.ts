import { Plugin, StartInterface } from '../../d.ts/interface';
export default class CommonPlugin implements Plugin {
    private global;
    onTenp(config: StartInterface): void;
    onRouter($class: any): void;
}
export declare const getGlobal: (name?: string) => any;
export declare const Global: (name: string) => any;
