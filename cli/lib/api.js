
const fs = require('fs');

console.log('')
console.log('*** 开始生成api文档 *** ')



__dirname = process.cwd();

var TenpConfig = require(__dirname+'/dist/server.js');
var ApiTree = [];


function FillingRouter(__apiTree, $child){
	
	// var query = [];
	// if($child.validation){
	// 	for(var key in $child.validation){
	// 		if(key == 'template' || key == 'disable' || key == '$$return')  continue;
	// 		query.push($child.validation[key])
	// 	}


	// }

	// for(let method of $child.method){

	// 	__apiTree.push({
	// 		[$child.url]: {
	// 			method: method,
	// 			query: query,
	// 			name: $child.name || $child.url
	// 		}
	// 	})


			
	// }


}
function TraversingRouter(RouterList, apiTree){

	for(var i in RouterList){

		var $router = new RouterList[i];
		var config = $router.config;
		var __apiTree = [];
		apiTree.push({
			[config.url]: {
				name: config.name || config.url,
				apiTree: __apiTree
			}
		});
		for(let $child of $router.routerConfig){
			FillingRouter(__apiTree, $child)
		}
		if(config.router){
			TraversingRouter(config.router, __apiTree);
		}

	}

}

TraversingRouter(TenpConfig.router, ApiTree);




fs.writeFile(__dirname+'/api.json', JSON.stringify({ 
	prot: TenpConfig.port||8080, 
	baseURI: TenpConfig.baseUrl||'',
	apiTree: ApiTree }, null, 2), function(){
	process.exit()	
})


// process.exit();