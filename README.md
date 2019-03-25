

<br>
<p align="center">
   <img src='https://maskletter.github.io/tenp-document/dist/assets/img/tenp.6d5e6693.svg' width='400' />
</p>

<br>

Based on the `express` implementation, using `typescript` enhancements, creating services via `pm2`

<a href="https://badge.fury.io/js/%40tenp%2Fcore" title="NPM Version Badge" rel="nofollow">
   <img src="https://badge.fury.io/js/%40tenp%2Fcore.svg" height="18">
</a>
<a href="https://www.npmjs.com/package/@tenp/core">
	<img src="https://img.shields.io/npm/dm/@tenp/core.svg" height="18">
</a>
<a href="https://img.shields.io/badge/node-%3E%3D6-brightgreen.svg" title="Node Limitation" rel="nofollow">
   <img src="https://img.shields.io/badge/node-%3E%3D6-brightgreen.svg" alt="npm version" height="18">
</a>
<a href="https://coveralls.io/github/maskletter/tenp" title="Node Limitation" rel="nofollow">
   <img src="https://coveralls.io/repos/github/maskletter/tenp/badge.svg?branch=master" height="18">
</a>
<a href="https://travis-ci.org/maskletter/tenp" title="Node Limitation" rel="nofollow">
   <img src="https://travis-ci.org/maskletter/tenp.svg?branch=master" height="18">
</a>
<a href="https://codeclimate.com/github/maskletter/tenp/maintainability">
   <img src="https://api.codeclimate.com/v1/badges/53669772f0a4dac97bd7/maintainability" />
</a>

👉👉👉[API Docs](https://tenp.maskletter.com/dist/)
<br>

---

 * [Express](https://github.com/expressjs/express)
 * [Typescript](http://www.typescriptlang.org/)
 * [pm2](https://github.com/Unitech/pm2)
 --- 
 * [router](https://tenp.maskletter.com/dist/use.html#router)
 * [interceptor](https://tenp.maskletter.com/dist/tenp-plugin.html#interceptor-拦截器)
 * [validator](https://tenp.maskletter.com/dist/tenp-plugin.html#validator-数据验证器)




<br />

#### Framework progress

<table>	
	<thead>
		<tr>
			<td align="center" width="50%">功能</td>
			<td align="center" width="50%">状态</td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td align="center">express</td>
			<td align="center">completed</td>
		</tr>
		<tr>
			<td align="center">typescript</td>
			<td align="center">completed</td>
		</tr>
		<tr>
			<td align="center">router</td>
			<td align="center">completed</td>
		</tr>
		<tr>
			<td align="center">interceptor</td>
			<td align="center">completed</td>
		</tr>
		<tr>
			<td align="center">validation</td>
			<td align="center">perfect</td>
		</tr>
		<tr>
			<td align="center">Api interface</td>
			<td align="center">undefined</td>
		</tr>
		<tr>
			<td align="center">pm2</td>
			<td align="center">completed</td>
		</tr>
		<tr>
			<td align="center">throw</td>
			<td align="center">completed</td>
		</tr>
		<tr>
			<td align="center">cli</td>
			<td align="center">completed,optimization</td>
		</tr>
		<tr>
			<td align="center">surroundings</td>
			<td align="center">completed</td>
		</tr>
	</tbody>


</table>
<br>
#### Installed via npm
```bash
$ npm install @tenp/cli -g
$ tenp init hellworld
$ cd hellworld
$ tenp dev
```
<br>



#### Create service
```typescript

import { Application } from 'express'
import { Start ,Router, Config, Get, Request, Response } from '@tenp/core';
@Router() 
class HelloWord{

	private msg: string = 'Hello, world'

	@config({ url: '/hello', name: 'hello', type: 'get' })
	private hello(req: Request, res: Response): void {
		res.end(`<h1>${this.msg}</h1>`)
	}
	
	@Get('/world')
	private world(req: Request, res: Response): void {
		res.end(`<h1>${this.msg}</h1>`)
	}

}
Start({
	port: 8080,
	router: [ HelloWord ],
}).then((app: Application) => {
	console.log('success')
})
```
