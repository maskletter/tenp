

declare module "../" {

    interface CommonInit{
        injectable?: Array<{class: Function, name: String, data?: any }>
    }

    interface Router{
        injectable?: Array<{class: Function, name: String, data?: any }>
    }


    //依赖注入
	function Injectable(name: string): any

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