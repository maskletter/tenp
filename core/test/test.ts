
import { expect } from 'chai';
import 'mocha';
import tenp, { Main, Router, config, inject } from '..'
import { objectToBoolean } from './tool'
import * as express from 'express'
import * as http from 'http'
import * as assert from 'assert';



process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H')

const interceptor = (req: tenp.Request, res: tenp.Response): void => {
  console.log('经过了hello路由')
}

@Router({ url: '/second' })
class SecondRouter extends tenp {

  @config({ url: '/interceptor', type: 'get', name: '测试路由', interceptorLevel: 3, validation: { phone: { type: 'phone' } }, validType: 'query', getData(){} })
  private testInterceptor(req: tenp.Request, res: tenp.Response): void {
    res.send('hello, world')
  }

}

@Router({ 
  name: 'router-hello', 
  url: '/hello',
  interceptor: interceptor,
  interceptorLevel: 0,
  router: [ SecondRouter ]
})
class HelloWorld extends tenp{

  @config({ url: '/hello', type: 'get', name: '测试路由', interceptorLevel: 0, validation: { phone: { type: 'phone' } }, validType: 'query', getData(){} })
  private getHello(req: tenp.Request, res: tenp.Response): void {
    res.send('hello, world')
  }

  @config({ url: '/world', type: ['get','post','put','delete','head'], name: '测试路由2', interceptorLevel: 0, validation: { phone: { type: 'phone' } }, validType: 'query', getData(){} })
  private getWorld(req: tenp.Request, res: tenp.Response): void {
    res.send('hello, world')
  }
}

describe('初始化服务', () => {
  it('创建tenp实例', async () => {
    var $tenp = await Main({ 
      port: 3687, 
    })
    expect(objectToBoolean($tenp)).to.be.deep.equal({ app: true, httpServer: true })
  });

  it('创建tenp实例(注入外部express实例)', async () => {
    const app: any = express();
    const server = http.createServer(app).listen(8080);
    var $tenp = await Main({ 
      port: 3688, 
      express(private_app: express.Application){
        assert(private_app == app)
      },
    }, app)
    expect(objectToBoolean($tenp)).to.be.deep.equal({ app: true })
    // expect(objectToBoolean($tenp)).to.include.keys('app');
  });


});

describe('路由模块', () => {
  it("检查router", () => {


    const $router: any = new HelloWorld();
    expect($router.$$config).to.be.a('object');
    expect($router.$$config).to.be.deep.equal({
      name: 'router-hello', 
      url: '/hello',
      interceptor: [ interceptor ],
      interceptorLevel: 0,
      provide_instancep: {},
      router: [ SecondRouter ]
    })
    
  })

  it('检查config', () => {
    const $router: any = new HelloWorld();
    assert(typeof $router.getHello === 'function')
    expect($router.$$childConfig).to.be.a('array')
    delete $router.$$childConfig[0].process
    delete $router.$$childConfig[0].getData
    expect($router.$$childConfig[0]).to.be.deep.equal({
      method: ['get'],
      url: '/hello',
      name: '测试路由',
      validation: { phone: { type: 'phone' } },
      validType: 'query',
      interceptorLevel: 0
    })
  })

})

describe('插件模块', () => {

  it('拦截器', (done: Function) => {
    Main({ 
      port: 3691, 
      baseUrl: '/inter',
      interceptor: function global(){
        done()
      },
      router: [ HelloWorld ],
    }).then(result => {
      const Forward = require('../lib/router').Forward;
      Forward.apply({
        req: {},
        status(status: number){
          return this;
        },
        json(result: any){
          // console.log(result)
        },
        send: function(result: any){
          // console.log(result)
        }
      }, ['/inter/hello/second/interceptor', { query: { 'phone': '13146595984' } }])
    })

  })

  it('数据验证器', () => {

      const validation1: tenp.Validation = {
        phone: {
          type: 'phone',
          name: '手机号',
          required: true
        },
        name: {
          type: 'string',
          required: false
        },
        done(err: tenp.ValidationError){
          console.log(`${err.name}验证不通过`)
        }
      }

      const Validator = require('../lib/plugin/validator.plugin')
      const $valid = new Validator();

      $valid.main({
        //模拟request
        query: { phone: '13146595984' }
      }, {
        //模拟response
        json(){}
      }, {
        //模拟@config配置
        method: 'get',
        validation: validation1
      })

  })


  it('注入器', () => {

    class TestInjectable{
      public name: string = '测试注入器'
    }
    @Router({})
    class TestRouter extends tenp{
      @inject('test-injectable') public test: TestInjectable;
      onInit(){
        expect(this.test).to.be.an.instanceof(TestInjectable);
      }
    }
    Main({ 
      port: 3689, 
      router: [ TestRouter ],
      provide: [ { class: TestInjectable, name: 'test-injectable' } ]
    })

  })

})


describe('接口请求', () => {
  Main({ 
    port: 3690, 
    router: [ HelloWorld ],
  })
  it('get测试',  () => {
    routerSim('post', '/hello/world');
  })
  it('post测试',  () => {
    routerSim('post', '/hello/world');
  })
  it('put测试',  () => {
    routerSim('put', '/hello/world');
  })
  it('delete测试',  () => {
    routerSim('delete', '/hello/world');
  })
  it('head测试',  () => {
    routerSim('head', '/hello/world');
  })
})



function routerSim(method: string, url: string){
  const allInterface = require('../lib/router').RouterUrl;
  expect(allInterface[url]).to.be.a('object');
  assert(allInterface[url].method.indexOf(method) != -1)
}