

"use strict";


module.exports = class ProvidePlugin {

    constructor(){
        this.global_provide = {};
    }

    //实例化注入器
    initProvide(config){
        const provide = config.provide || [];
        config.provide_instancep = {};
        provide.forEach(data => {
            config.provide_instancep[data.name] = new data.class(data.data || undefined)
        })
    }

    //向上搜寻注入器
    findParentProvide($router, config, name){
        let provide = {};
        const $this = this;
        //如果当前类存在注入,则直接返回
        if(config.provide_instancep[name]){  
            provide = config.provide_instancep[name];
        }else{
            getParent($router.$$parentId || null);
        }

        function getParent($$id) {
            const $parent = $this.RouterDbId[$$id];
            //判断是否存在router对象
            if($parent){
                if($parent.config.provide_instancep[name]){
                    provide = $parent.provide_instancep[name];
                }else{
                    getParent($parent.$$parentId||null)
                }
            }else{
                //不存在则判断全局注入器是否存在
                provide = $this.global_provide[name] || {};
            }
            
        }

        return provide;

    }

    onInit(config){
        //得到router数
        this.RouterDbId = require('../main.js').RouterDbId;
        //初始化全局注入器
        const provide = config.provide || [];
        provide.forEach(data => {
            this.global_provide[data.name] = new data.class(data.data || undefined)
        })
    }
    

    onInitClass({ currentConfig, $router }){

        this.initProvide(currentConfig);
        

        for(let key in $router){
            if(key.substr(0,13) != 'tenp_provide_')  continue;
            let name = key.substr(13);
            const provide = this.findParentProvide($router, currentConfig, name)
            let classname = $router[key];
            $router[classname] = provide;
            delete $router.key
        }
        

    }

}