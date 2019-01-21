"use strict";

const tool = require('../tool');


module.exports =  class Interceptor{

    constructor(globalInterceptor){
        this.globalInterceptor = tool.transArray(globalInterceptor);
        this.interceptorDb = {};
    }

    async runInterceptor(request, response, config){
        for(let interceptor of config.interceptor){
            const result = await interceptor(request, response, config);
            if(result == false){
                return false;
            }
        }
        return Promise.resolve(true);
    }

    whetherToContinue(result){
        return new Promise((resolve, reject) => {
            if(result == true || result == void 0){
                resolve()
            };
        })
    }

    //获取router拦截器
    getRouterInterceptor(id){
        let interceptor = [];
        const eachParent = id => {
            const $parent = this.FindById(id);
            if(!$parent) return [];
            const _interceptor = tool.transArray($parent.config.interceptor);
            const _level = $parent.config.interceptorLevel || 0;
            
            if(_level == 2 || _level == 4){

            }else if(_level == 3){
                const grandParent = this.FindById($parent.parentId)
                eachParent(grandParent.parentId);
            }else if(_level == 0 || _level == 1){
                interceptor = [ ..._interceptor, ...interceptor ];
                eachParent($parent.parentId);
            }
        }
        eachParent(id);
        return interceptor;
    }

    //获取拦截器
    getInterceptor(config){
        const id = config.$class.$$id;

        const level = config.interceptorLevel || 0;
        const thisInterceptor = tool.transArray(config.interceptor);
        const $parent = this.FindById(config.$class.$$id);
        const parentLevel = $parent.config.interceptorLevel || 0;
        let interceptor = [];
        let routerInterceptor = [];
        let noParentInter = false;

        //避免在同一个class下的接口，进行多次追寻router拦截器
        if(this.interceptorDb[id]){
            routerInterceptor = [].concat(this.interceptorDb[id]);
            noParentInter = true;
        }
   
        if(level == 4 || level == 2){
            interceptor = thisInterceptor;
        }else if(level == 3) {
            interceptor = thisInterceptor;
            const grandParent = this.FindById($parent.parentId || 'null')
            if(grandParent){
                !noParentInter && (routerInterceptor = this.getRouterInterceptor(grandParent.parentId));
                interceptor = [...routerInterceptor, ...interceptor];
            }
            
        }else if(level == 0 || level == 1){
            !noParentInter && (routerInterceptor = this.getRouterInterceptor($parent.id));
            interceptor = [...routerInterceptor, ...thisInterceptor];
        }

        if((level == 0 || level == 3 || level == 4) && (parentLevel == 0 || parentLevel == 2 || parentLevel == 3)){
            interceptor = [ ...this.globalInterceptor, ...interceptor ]
        }
        
        this.interceptorDb[id] = routerInterceptor;
       
        return interceptor;
        
    }

    //设置拦截器
    setInterceptor(config){
        const interceptor = this.getInterceptor(config);
        config.interceptor = interceptor;

    }


    /**
     * 初始化插件时候运行
     * @param  {tenp初始化配置} config [description]
     */
    onInit(config){
        this.globalInterceptor = tool.transArray(config.interceptor);
        this.FindById = require('../../index').FindById
    }
 
    /**
     * 初始化插件时候运行
     * @param  {url配置} method [description]
     * @param  {url所在class配置} method [description]
     */
    async onInitRequest(config, classConfig){
        this.setInterceptor(config)
    } 

   
    /**
     * 运行于进入接口请求时候
     * @param  {url配置} config [description]
     */
    async main(request, response, config){
        const result = await this.runInterceptor(request, response, config)

        await this.whetherToContinue(result)
    }

}
