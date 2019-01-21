





declare module "../index" {



    interface CommonConfig{

        interceptor?: Array<Interceptor> | Interceptor
        
	}
	

    interface Router{
        
		/**拦截器*/
		interceptor?: Array<Interceptor> | Interceptor
		/**
		 * 拦截器级别
		 * 1： 抛弃全局得拦截器
		 * 2:  抛弃之前所有通过class继承到的拦截器
		 * 3:  抛弃父class的拦截器，但是保留全局得拦截器
		 * 4:  抛弃父class的拦截器，和全局拦截器
		 */
        interceptorLevel?: 0 | 1 | 2 | 3 | 4
        
    }

    interface RouterConfig{

		/**拦截器*/
		interceptor?: Array<Interceptor> | Interceptor
		/**自定义post解析方式*/
		// uploadConfig?: tenp
		/**
		 * 拦截器级别
		 * 1： 抛弃全局得拦截器
		 * 2： 仅保留自身拦截器
		 * 3： 抛弃所在class拦截器，但是保留全局得拦截器
		 * 4： 抛弃全部class拦截器，但是保留全局得拦截器
		 */
        interceptorLevel?: 0 | 1 | 2 | 3 | 4,
        
    }

    /**
	 * 拦截器
	 */
	interface Interceptor{
		(request: tenp.Request, response: tenp.Response): void
	}
	interface InterceptorObject {

	}
	type Interceptors = Interceptor[];

}


declare class Interceptor {
    name: string
    version: string
    main: Function
}

export default Interceptor;