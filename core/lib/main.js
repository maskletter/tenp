"use strict";

const http = require('http');
const https = require('https');
const express = require('./tool/express');
const crypto = require('crypto');
const tool = require('./tool')
const router = require('./router')
const Validation = require('./plugin/validator.plugin')
const Receive = require('./plugin/receive.plugin')
const InjectablePlugin = require('./plugin/Injectable.plugin');
const fs = require('fs');
const path = require('path');
const Interceptor = require('./plugin/interceptor.plugin')

//class节点
let RouterTree = [];
//所有classid
let RouterDbId = {};
//沙盒
let SandboxMap = {};
//验证器type


//运行框架启动完成时间
async function runOntenp(){
    for(const key in RouterDbId){
        if(RouterDbId.hasOwnProperty(key)){
            RouterDbId[key].$router.onTenp && await RouterDbId[key].$router.onTenp();
        }
    }
}

//创建隔离房间
function CreateClassSandbox($router, plugin){
    SandboxMap[$router.$$id] || (SandboxMap[$router.$$id] = {});
    SandboxMap[$router.$$id].$$default = Object.assign({}, $router.$$config);
    return SandboxMap[$router.$$id];
}

//寻扎房间
function findClassSandbox(id = ''){
    if(!id) return {};
    else return SandboxMap[id] || {}
}

//运行插件
function LoaderPlugin($router, parentId = '', pluginMap){
    const sandboxMap = CreateClassSandbox($router)
    return async () => {
        async function run(index){
            const plugin = pluginMap[index];
            if(plugin){
                const className = plugin.constructor.name;
                let parentConfig = findClassSandbox(parentId)[className] || {};
                let defaultConfig = Object.assign({}, sandboxMap.$$default);
                sandboxMap[className] = defaultConfig;
                if(plugin.onInitClass){
                    sandboxMap[className] = await plugin.onInitClass({ $router, currentConfig: sandboxMap[className], parentConfig: parentConfig}) || defaultConfig;
                }
                index++;
                await run(index)
            } 
        }
        await run(0)    
    }

}


//生成url方法
async function CreateUrl(config, pluginMaps){
    let _config = config;
    for(const plugin of pluginMaps){
        plugin.onInitRequest && plugin.onInitRequest(config, findClassSandbox(config.$class.$$id)[plugin.constructor.name])
    }
    for(const method of config.method){
        router(method, _config);
    }
    
}

//初始化路由
async function CreateRouter(config, Parent_RouterTree){

    /**
     * [ { class: Router, data: {} },  Router2 ]
     */
    for(let data of config.router){
        let RouterClass = null;
        let RouterData = undefined;
        if(typeof(data) == 'function'){
            RouterClass = data;
        }else{
            RouterClass = data.class;
            RouterData = data.data;
        }

        //初始化class
        const $router = new RouterClass();
        const id = crypto.createHash('md5').update(RouterClass.name+Math.random()).digest('hex');
        $router.$$id = id;
        $router.$$parentId = config.id;
        
        await LoaderPlugin($router, config.id, config.$tenp.plugin)()

        let _routerTree = { 
            children: [], 
            class: RouterClass, 
            name: RouterClass.name, 
            parentId: config.id,
            $router,
            config: $router.$$config,
            id
        };

        //class拼装的路径
        const routerUrl = config.url+($router.$$config.url||'');

        //遍历是否需要设置全局变量
        for(let key in $router){
            if($router[key] == '$$global')  {
                $router[key] = config.$tenp.global || {};
            }
            if($router[key] == '$$data')    {
                $router[key] = RouterData || {};
            }
        }
        
        //添加进路由树当中
        RouterDbId[_routerTree.id] = _routerTree;
        Parent_RouterTree.push(_routerTree)

        //运行onInit事件 
        $router.onInit && $router.onInit();
        
        for(let method of ($router.$$childConfig || [])){
            await CreateUrl({
                ...method,
                url: config.$tenp.baseUrl+routerUrl+method.url,
                $tenp: config.$tenp,
                $class: $router,
            }, config.$tenp.plugin);
        }

        //运行onAfter事件
        $router.onAfter && $router.onAfter();
            

        // 加载子路由
        if($router.$$config.router){
            
            await CreateRouter({
                router: $router.$$config.router,
                url: routerUrl,
                id: _routerTree.id,
                $tenp: config.$tenp,
            }, _routerTree.children)
        }

    }

}

//创建服务器
function RunServer(app, $tenp){
    const httpServer = http.createServer((req,res)=> {

        //加载headers
        for(let name in $tenp.headers){
            res.setHeader(name, $tenp.headers[name])
        }

        app(req, res);

    }).listen($tenp.port);

    //配置Https服务器
    if($tenp.https){ 
        const httpsServer = https.createServer($tenp.https, function(req, res){
            //加载headers
            for(let name in $tenp.headers){
                res.setHeader(name, $tenp.headers[name])
            }

            app(req, res);

        }).listen($tenp.https.port);
        
        return { httpServer, httpsServer }
    }
    
    return { httpServer }
}

//总入口
module.exports = async function(config, publicApp){
    config.plugin = [Interceptor, Receive,Validation, InjectablePlugin,...tool.transArray(config.plugin)]
    config.router = tool.transArray(config.router);
    const $tenp = Object.assign({
        baseUrl: '',
    },config);
    
    //初始化插件实例
    $tenp.plugin = $tenp.plugin.map(data => {
        let PluginClass = null;
        let PluginConfig = {};
        if(typeof(data) == 'function'){
            PluginClass = data;
        }else {
            PluginClass = data.name;
            PluginConfig = data.config || {};
        };
        const $plugin = new PluginClass(PluginConfig);
        $plugin.onInit && ($plugin.onInit($tenp) || $tenp);
        return $plugin;
    })

    //加载express
    const app = publicApp || express({
        plugin: $tenp.plugin
    });

    //抛出的自定义express配置
    $tenp.express && $tenp.express(app);
    
    //加载静态文件
    if($tenp.static){
        app.use(express.static($tenp.static))
    }
    

    const serverMap = RunServer(app, $tenp)

    await CreateRouter({
        router: $tenp.router,
        url: '',
        $tenp,
    }, RouterTree);


    await runOntenp();


    //决定是否创建url.json文件
    if(process.env.createUrlPath){
       
        let JSonContent = []
        for(let key in router.RouterUrl){
            JSonContent.push({
                name: router.RouterUrl[key].name || '',
                url: key,
                method: router.RouterUrl[key].method
            })
        }

        fs.writeFileSync(path.resolve('url.json'), JSON.stringify(JSonContent, null, 2), undefined, "utf8")

    }

    //清除无用变量
    // SandboxMap = undefined;

    app.use(router.appRouter);


    if(publicApp) return { app: publicApp };
    return { ...serverMap, app }

}


module.exports.RouterTree = RouterTree; 
module.exports.RouterDbId = RouterDbId;
module.exports.getPlugin = findClassSandbox

module.exports.runOntenp = runOntenp; 
module.exports.CreateClassSandbox = CreateClassSandbox;
module.exports.findClassSandbox = findClassSandbox

module.exports.findClassSandbox = findClassSandbox; 
module.exports.LoaderPlugin = LoaderPlugin;
module.exports.CreateUrl = CreateUrl
module.exports.CreateRouter = CreateRouter
module.exports.RunServer = RunServer