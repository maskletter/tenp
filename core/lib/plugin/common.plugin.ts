
import { Plugin, StartInterface } from '../../d.ts/interface'

let Save_Global_Variable: any = {};

export default class CommonPlugin implements Plugin {

	private global: Object = {};

	public onTenp(config: StartInterface): void{
		Save_Global_Variable = this.global = config.global;
	}

	public onRouter($class: any): void{
		for(let key in $class){
			if(key.substr(0,13) != 'tenp_glogal_')  continue;
			const name: string = key.substr(12);
			$class[$class[key]] = (this.global as any)[name];
			delete $class[key]
		}
	}

}

export const getGlobal: (name?: string) => any = (name?: string): any => {

	if(!name){
		return Save_Global_Variable;
	}else{
		return Save_Global_Variable[name]
	}

}

export const Global: (name: string) => any = (name:string): any => {
	return (target: any, propertyKey: string) => {
		target[propertyKey] = {}
        target['tenp_glogal_'+name] = propertyKey;
	}
}