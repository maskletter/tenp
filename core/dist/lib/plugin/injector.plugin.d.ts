import { Plugin, StartInterface, RouterConfig } from '../../d.ts/interface';
/**
 * Used to implement factory services
 */
export default class InjectorPlugin implements Plugin {
    private globalProvide;
    onTenp(config: StartInterface): void;
    private initProvide;
    private searchServer;
    onRouter($class: any, routerConfig: RouterConfig): void;
}
export declare const Injector: (name: string) => any;
