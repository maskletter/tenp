"use strict";

module.exports = class Validator{

    constructor(config = {}){
        this.validationType = {
            phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
            number: /^[0-9]*$/,
            required: /\S/
        }
      
        //插件名称
        this.name = 'validator';
        //插件名称
        this.name = 'validator';
      
    }

    //默认错误处理
    done(err, response){
        response.json({ code: 0, msg: err })
    }

    getData(request, validType){

        switch (validType) {
            case 'body':
                return request.body;
            case 'query':
                return request.query;
            case 'param':
                return request.params;
            case 'all':
                return { ...request.params, ...request.query, ...request.body }
        }
  
    }

    createErrorMsg(done, response, valid, name, value, condition){
        const json = {
            name,
            alias: valid.name,
            type: valid.type,
            condition,
            value,
        }
        if(done){
            done(json, response)
        }else if(valid.done){
            valid.done(json, response);
        }else{
            this.done(json, response);
        }
    }

    start(request, response, config, validType){
        const data = this.getData(request, validType) || {}
        return new Promise((resolve, reject) => {
            let error = false;
            for(let name in config.validation){
                if(name == 'done' ){
                    continue;
                }
                const valid = config.validation[name];
                const value = data[name] || '';
                if((valid.required != false) && !this.validationType.required.test(value)){
                    this.createErrorMsg(config.validation.done, response, valid, name, value, 'required')
                    error = true;
                    break;
                }
                if(valid.type && value && this.validationType[valid.type] && !this.validationType[valid.type].test(value)){
                    this.createErrorMsg(config.validation.done, response, valid, name, value, 'type:'+valid.type)
                    error = true;
                    break;
                }
                if(valid.regular && value && !valid.regular.test(value)){
                    this.createErrorMsg(config.validation.done, response, valid, name, value, 'regular:'+String(valid.regular))
                    error = true;
                    break;
                }
            }
            if(!error){
                resolve();
            }
        })
    }

    async main(request, response, config){
        if(!config.validation) return;
        let validType = config.validType || (config.method == 'post' ? 'body' : 'query');
        await this.start(request, response, config, validType);
    }

    onInit(config){
        if(config.validatorDone){
            this.done = config.validatorDone
        }
        this.validationType = { ...this.validationType, ...config.validationType }
    }
    

}
