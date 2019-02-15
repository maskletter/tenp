



module.exports = class provide{

    constructor(){}

    //初始化注入器
    initProvide(provideMap = []){
        let __map = {};
        for(const provide of provideMap){
            __map[provide.name] = new provide.class(provide.data || undefined)
        }
        return __map;
    }

    onInit(config){
        this.RouterDbId = require('../main.js').RouterDbId;
        this.global_provide = this.initProvide(config.provide);
    }

    findProvide(_id, __router){
        let provideMap = {};
        const $this = this;
        if(!_id){
            return { ...this.global_provide }
        }else{
            getParent(_id, __router);
        }
       
        function getParent(id, __router){
            
            const $router =  __router || $this.RouterDbId[id];
            provideMap = Object.assign(provideMap, $this.initProvide($router.config.provide));
            if($router.$$parentId){
                getParent($router.$$parentId)
            }else{
                provideMap = Object.assign(provideMap, $this.global_provide)
            }
        }

        return provideMap;

    }

    onInitClass({$router, currentConfig, parentConfig}){
       
        const provideMap = this.findProvide($router.$$id, { config: currentConfig });

        for(let key in $router){
            if(key.substr(0,13) != 'tenp_provide_')  continue;
            let name = key.substr(13);
            let classname = $router[key];
            $router[classname] = provideMap[name];
            delete $router.key
        }
        
        return currentConfig;
    }

    onAfter(){
        
    }

}



module.exports.inject = function(name){

	return function (target, propertyKey, descriptor) {
        target[propertyKey] = {}
        target['tenp_provide_'+name] = propertyKey;
    }

}