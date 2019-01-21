


declare module '../'{

    interface InitConfig {

        /**
         * 更改全局默认post/put获取方式
         */
        getData?:(request: tenp.Request, response: tenp.Response) => void

    }

    interface RouterConfig {
        
        /**
         * 更改全局默认post/put获取方式
         */
        getData?:(request: tenp.Request, response: tenp.Response) => void
        
    }

}


declare class Receive {
    name: string
    version: string
    main: Function
}

export default Receive;