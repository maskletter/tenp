

import tenp from '..';


declare global{
	namespace tenp{
	}
}

declare module "../" {



	interface InitConfig {
		/**
		 * 验证器->type
		 */
		validationType?: { [prop: string]: any }
		/**
		 * 验证器默认错误回调
		 */
		validatorDone?(): void
	}

    interface Validation {
		
	
		done?: any;
		
		disable?: any;

		[argy: string]: {
			type?: 'string' | 'number' | 'boolean' | any,
			required?: boolean | false,
			name?: string,
			regular?: RegExp,
			description?: string,
			default?: string
			render?: (value: string, data: any) => boolean
			done?: ValidationDone
		} | Function | 'string' | 'number' | 'boolean' | boolean |  any;

    }
    
    /**
	 * 参数验证器
	 */
	interface ValidationError {
		name: string,
		condition: string,
		value: string,
		alias: string
	}
	interface ValidationDone {
		(err: ValidationError, response: tenp.Response): void
	}

    interface RouterConfig {
		/**
		 * 效验器用于数据验证
		 * 仅在验证不通过时候执行
		 * [prop: string]:() => void 
		 * $$return(err: string, response: Response): void
		 */
		validation?: Validation,
		validType?: 'query' | 'body' | 'param' | 'all'
    }
}

declare class Validation {
    name: string
    version: string
    main: Function
}

export default Validation;