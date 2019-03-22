
import { expect } from 'chai';
import 'mocha';
import { Start, Request, dbRouterInfo, RouterInfo, Response, Injector, 
  Get, Post, Delete, Put, Head,
  Router, Config, RouterComponent, Validator, ValidatorError } from '../'
import { objectToBoolean } from './tool'
import * as express from 'express'
import * as http from 'http'
import * as assert from 'assert';



process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H')

const interceptor = (req: Request, res: Response): void => {
  // console.log('经过了hello路由')
}

@Router({ url: '/second' })
class SecondRouter extends RouterComponent {

  @Config({ url: '/interceptor', type: 'get', name: '测试路由', interceptorType: 'abandon', validator: { phone: { type: 'phone' } }, validatorType: 'query'  })
  private testInterceptor(req: Request, res: Response): void {
    res.send('hello, world')
  }

}

@Router({ 
  name: 'router-hello', 
  url: '/hello',
  interceptor: [interceptor],
  interceptorType: 'inherit',
  router: [ SecondRouter ]
})
class HelloWorld extends RouterComponent{

  @Config({ url: '/hello', type: 'get', name: '测试路由', interceptorType: 'abandon', validator: { phone: { type: 'phone' } }, validatorType: 'query'  })
  private getHello(req: Request, res: Response): void {
    res.send('hello, world')
  }

  @Config({ url: '/world', type: 'get', name: '测试路由2', interceptorType: 'abandon', validator: { phone: { type: 'phone' } }, validatorType: 'query' })
  private getWorld(req: Request, res: Response): void {
    res.send('hello, world')
  }


  @Config({ url: '/world3', type: 'get', name: '测试路由3', validator: { phone: { type: 'phone' } }, validatorType: 'query' })
  private getWorld2(req: Request, res: Response): void {
    res.send('hello, world')
  }


}

describe('初始化服务', async () => {
  it('创建tenp实例', async () => {
    var $tenp = await Start({ 
      port: 3687, 
    })
  });

  it('创建tenp实例(注入外部express实例)', async () => {
    const app: any = express();
    const server = http.createServer(app).listen(8080);
    var $tenp = await Start({ 
      port: 3688, 
      express(private_app: express.Application){
        assert(private_app == app)
      },
    }, app)
  });


});

describe('路由模块', async () => {
  const routerInfo: RouterInfo = dbRouterInfo[HelloWorld.prototype.$$id];
  it("检查router", () => {
    expect(objectToBoolean(Object.assign({},routerInfo))).to.be.deep.equal({ 
        id: true, 
        name: true, 
        config: true, 
        functoin: true, 
        path: true 
    })
    expect(objectToBoolean(Object.assign({}, routerInfo.config))).to.be.deep.equal({ 
        name: true,
        url: true,
        interceptor: true,
        interceptorType: true,
        router: true 
    })
    
    
  })

  it('检查config', () => {
    expect(routerInfo.path.length).to.be.deep.equal(3);
    expect(routerInfo.path[1].config).to.be.deep.equal({ 
        url: '/world',
        type: 'get',
        name: '测试路由2',
        interceptorType: 'abandon',
        validator: { phone: { type: 'phone' } },
        validatorType: 'query' 
    })
    assert(typeof routerInfo.path[0].callback === 'function')
  })

})

describe('插件模块', async () => {

  it('拦截器', (done: Function) => {
    Start({ 
      port: 3691, 
      baseUrl: '/inter',
      interceptor: [function global(){
        done()
      }],
      router: [ HelloWorld ],
    }).then(result => {
      http.get('http://localhost:3691/inter/hello/world3?phone=13654777775', (res: http.IncomingMessage) => {
        // console.log(res)
      })
    })

  })

  it('数据验证器', (done: Function) => {

      const validation1: Validator = {
        phone: {
          type: 'phone',
          name: '手机号',
          required: true,
          message: {
            type: '手机类型不正确'
          }
        },
        name: {
          type: 'string',
          required: false
        },
        done(err: ValidatorError){
          done();
        }
      }

      const validator = new (require('../dist/lib/plugin/validator.plugin').default as any)
      validator.validator({ phone: '13*654777775' }, validation1)

  })


  it('注入器', () => {

    class TestInjectable{
      public name: string = '测试注入器'
    }
    @Router({})
    class TestRouter extends RouterComponent {
      @Injector('test-injectable') public test: TestInjectable;
      onInit(){
        expect(this.test).to.be.an.instanceof(TestInjectable);
      }
    }
    Start({ 
      port: 3689, 
      router: [ TestRouter ],
      provide: [ { class: TestInjectable, name: 'test-injectable' } ]
    })

  })

})


describe('接口请求', () => {

  @Router()
  class TestRouter{
    @Get('/test')
    private dawdget1(request: Request, response: Response): void {
      response.end('success')
    }
  }

  Start({ 
    port: 3690, 
    router: [ TestRouter ],
  }).then(result => {
  
  })
  it('get测试',  (done: Function) => {
    routerSim('get', '/test', done);
  })
})



async function routerSim(method: string, url: string, done: Function){
  const req = http.request({ method: method, port: 3690 , path: url }, (res: any) => {
    done();
  })
  req.end();
}