
import Tenp from 'tenp';
import { Main, Router, config } from 'tenp';

 
@Router({
	
}) 
class HelloWord{


	@config({ url: '/hello', name: 'hello', type: 'get' })
	private hello(req: tenp.Request, res: tenp.Response): void {
		res.end('<h1>Hello, world</h1>')
	}

	@config({ url: '', name: 'hello', type: 'get' })
	private home(req: tenp.Request, res: tenp.Response): void {
		res.end('<h1>Hello, tenp</h1>')
	}

}


Main({
	port: 6578,
	router: [ HelloWord ]
})


console.log('服务启动完成: 6578')