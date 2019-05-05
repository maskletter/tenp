import tenp from '../../interface';
export default class CommonPlugin implements tenp.Plugin {
    private global;
    onTenp(config: tenp.StartInterface): void;
    onRouter($class: any): void;
}
export declare const getGlobal: (name?: string) => any;
export declare const Global: (name: string) => any;
