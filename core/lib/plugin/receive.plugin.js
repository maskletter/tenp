"use strict";

const formidable = require('formidable');

module.exports = class Receive {

    receiveData(request){
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();

            //去除所有文件,只保留文字内容
            form.onPart = function(part) {
            if (!part.filename) {
                form.handlePart(part);
            }
            }

            form.parse(request, function(err, fields, files) {
                if(err){
                    throw err
                }
                resolve(fields);
            });
        })
    }

    start(request, response, config){
        const callback =  config.getData ? config.getData : this.receiveData;
   
        return new Promise((resolve, reject) => {
            callback(request, response).then(result => {
                request.body = result;
                resolve();
            }).catch(err => {
               
            })

        })
     
    }


    onInit({getData}){
        if(getData){
            this.receiveData = getData;
        }
    }

    async main(request, response, config){

        if(config.method != 'post') return;
        await this.start(request, response, config)

    }

}