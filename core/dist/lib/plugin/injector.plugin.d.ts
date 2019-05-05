import tenp from '../../interface';
/**
 * Used to implement factory services
 */
export default class InjectorPlugin implements tenp.Plugin {
    private globalProvide;
    onTenp(config: tenp.StartInterface): void;
    private initProvide;
    private searchServer;
    onRouter($class: any, routerConfig: tenp.RouterConfig): void;
}
export declare const Injector: (name: string) => any;
