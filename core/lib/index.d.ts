

import { Request as ExpressRequest, Response as ExpressResponse, Application } from 'express';
import * as http from 'http';
import * as https from 'https';
import './plugin/interceptor.plugin'
import './plugin/receive.plugin'
import './plugin/validator.plugin'
import './plugin/Injectable.plugin'



declare class tenp {
	onInit(): void;
	onAfter(): void;
	onTenp(): void;
	main(): void;
	$$id: string
	$$parentId: string
	public static $$config: any[]
}

//插件类库
export declare namespace Plugin{

	/**
	 * 扩展express.request方法
	 */
	const request: { [prop: string]: Function }
	/**
	 * 扩展express.response方法
	 */
	const response: { [prop: string]: Function }

    /**
     * 初始化插件时候运行
     * @param  {tenp初始化配置} config [description]
     */
	function onInit(config: tenp.InitConfig): void

 
    /**
     * 初始化插件时候运行
     * @param  {url配置} method [description]
     * @param  {url所在class配置} method [description]
     */
	function InitRequest(config: tenp.RouterConfig, classConfig: tenp.Router): void

	/**
	 * 加载router时运行
	 * @param  {当前路由对象} $router [description]
	 * @param  {当前路由配置} currentConfig [description]
	 * @param  {父级路由配置} parentConfig [description]
	 */
	function InitClass(config: { $router: Function, currentConfig: tenp.Router, parentConfig: tenp.Router }): tenp.Router;
	
    /**
     * 插件主方法，运行于进入接口请求时候
     * @param  {进入路由的request对象} request [description]
     * @param  {进入路由的response对象} response [description]
     * @param  {url配置} config [description]
     */
	function main(request: tenp.Request, response: tenp.Response, config: tenp.RouterConfig): void;


}

declare global{
	namespace tenp{
		interface Request extends ExpressRequest{}
		interface Response extends ExpressResponse{
			router(path: string, config?: {
				query?: { [argv: string]: any }, 
				body?: { [argv: string]: any },
				method?: string | 'get'
			}): any;
			parentId: string
			id: string
		}
		interface CommonConfig {

			/**
			 * 路由
			 *  param( router: Array<Function  | { router: Function, enable: boolean> )
			 */
			router?: Array<Function | { class: Function, data?: any }>;
	
		}
	
		interface CommonInit{
	
			/**
			 * 路由根路径
			 *  bacseUrl?: string|''
			 */
			baseUrl?: string|''
	
			/**
			 * 静态文件路径，基于express(app.use)
			 *  static: string
			 */
			static?: string
	
			/**
			 * 静态文件路径，基于express(app.use)
			 *  static: string
			 */
			headers?: { [args: string]: string }
	
			global?: any
	
			/**
			 * 处理接口内throw抛出的错误
			 * @type {[type]}
			 */
			throw?:(request: tenp.Request, response: tenp.Response, status: number, error: Error) => void;
		}
	
		interface InitConfig extends CommonConfig, CommonInit {
	
			/**
			 * 端口号，默认8080
			 *  port: number | 8080
			 */
			port: number | 8080;

			/**
			 * http配置
			 * @type {any}
			 */
			http2?: {
				[argv: string]: any
			},
			/**
			 * https配置
			 */
			https?: {
				key: Buffer,
				cert: Buffer,
				port: number,
				//强制把http转换成https
				// force?: boolean
			}

			plugin?: Array<Function | {name: Function, data: any}>
	
			/**
			 * 配置express
			 */
			express?(app: Express.Application): void
		
		}
		interface Router extends CommonConfig{
			/**类名字，也许会有大用*/
			name?: string;
			url?: string;
		}
		interface RouterConfig{
			/**路由名字，也许会有大用*/
			name?: string;
			/**
			 * 请求方式
			 * type: Array<string> | string
			 */
			type: Array<string> | string
			/**
			 * 路径
			 * url: string
			 */
			url: string
			/**
			 * 控制器
			 */
			controller?: string
			
		}
		interface RouterTree{
			children: this[], 
			class: Function,
			name: string
			parentId: string
			config: tenp.Router,
			id: string
		}
		interface controllerInterface{
			(request: tenp.Request, response: tenp.Response): void
		}
	}

}

		

export const Router:(config: tenp.Router) => any;
export const createController:(name: string, callback: tenp.controllerInterface) => any;
export const controller:(name: string) => (request: tenp.Request, response: tenp.Response) => void;
export const config:(config: tenp.RouterConfig) => any;
export const Main:(config: tenp.InitConfig, app?: Application) => Promise<{ app: Application, httpServer: http.Server, httpsServer: https.Server }>;
export const data:() => any;
export const Global:() => any;
export const FindById:(id: string) => RouterTree;
export const FindByName:(name?: string) => RouterTree[];
export as namespace tenp;
export default tenp;