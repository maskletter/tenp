

declare module "../" {

    interface CommonInit{
        provide?: Array<{class: Function, name: String, data?: any }>
    }

    interface Router{
        provide?: Array<{class: Function, name: String, data?: any }>
    }


    //依赖注入
	function inject(name: string): any

}


// const Injectable = function(){

// }

declare class InjectablePlugin {
    name: string
    version: string
    main: Function
}
export const Injectable: (name: string) => any;
export default InjectablePlugin;