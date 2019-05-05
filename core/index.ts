import tenp from './interface'
import { dbRouterInfo, Router, Config, Get, Post, Delete, Put, Head } from './lib/router'
export { Controller, createController } from './lib/consoller'
import Start from './lib/server'
export { Injector } from './lib/plugin/injector.plugin'
export { Validator, ValidatorError } from './lib/plugin/validator.plugin'
export class RouterComponent{
	$$id: string
	$$parentId: string
}

export { Start, Router, Config, Get, Post, Delete, Put, Head, dbRouterInfo };
export default tenp;
