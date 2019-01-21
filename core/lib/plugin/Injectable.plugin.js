



module.exports = class Injectable{

    constructor(){}

    //初始化注入器
    initInjectable(injectableMap = []){
        let __map = {};
        for(const injectable of injectableMap){
            __map[injectable.name] = new injectable.class(injectable.data || undefined)
            // console.log(__map[injectable.name])
        }
        return __map;
    }

    onInit(config){
        this.RouterDbId = require('../main.js').RouterDbId;
        this.global_injectable = this.initInjectable(config.injectable);
    }

    findInjectable(_id){
        let injectableMap = {};
        const $this = this;
        if(!_id){
            return { ...this.global_injectable }
        }else{
            getParent(_id);
        }
       
        function getParent(id){
            
            const $router = $this.RouterDbId[id];
            injectableMap = Object.assign(injectableMap, $this.initInjectable($router.config.injectable));
            if($router.$$parentId){
                getParent($router.$$parentId)
            }else{
                injectableMap = Object.assign(injectableMap, $this.global_injectable)
            }
        }

        return injectableMap;

    }

    onInitClass({$router, currentConfig, parentConfig}){
  
        const injectableMap = this.findInjectable($router.$$parentId);
        // console.log(injectableMap)
        for(let key in $router){
            if(key.substr(0,16) != 'tenp_injectable_')  continue;
            let name = key.substr(16);
            let classname = $router[key];
            $router[classname] = injectableMap[name];

            delete $router.key
        }
        
        return currentConfig;
    }

    onAfter(){
        
    }

}



module.exports.Injectable = function(name){

	return function (target, propertyKey, descriptor) {
        target[propertyKey] = {}
        target['tenp_injectable_'+name] = propertyKey;
    }

}