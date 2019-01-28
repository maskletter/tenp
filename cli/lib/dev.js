
const { exec, spawn, spawnSync, fork } = require('child_process');
const notifier = require('node-notifier');
const http = require('http');
const ts = require("typescript");
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const formatHost = {
    getCanonicalFileName: function (path) { return path; },
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: function () { return ts.sys.newLine; }
};
const { con, extendTenpConfig, sendSystemMessage, getEnv, readJson, cwd, os, getPackConfig } = require('./tool.js');
const tsconfig = readJson(cwd, 'tsconfig.json')
const packConfig = getPackConfig();
let process_server = undefined;

const srcPath = tsconfig.compilerOptions.rootDir ? path.resolve(cwd, tsconfig.compilerOptions.rootDir) : '';
const outPath = tsconfig.compilerOptions.outDir ? path.resolve(cwd, tsconfig.compilerOptions.outDir) : '';

ts.sys.writeFile = function(fileName, data, writeByteOrderMark) {
      // If a BOM is required, emit one
      if (writeByteOrderMark) {
          data = byteOrderMarkIndicator + data;
      }
      var fd;

      data = data.replace(/require\(['"](([\s\S])*?)['"]\)/g, function(a,b,c,d){
        const rootUrl = fileName.replace(outPath,'');
        const importUrl = b.split('/');
        
        if(b[0] == '/' || b.substr(0,2) == './' || b.substr(0,3) == '../'){
            //不需要进行路径修改，忽略
            
        }else{
          //判断根目录是否存在引用的库文件夹
          const url = path.resolve(srcPath, importUrl[0]);

          if(fs.existsSync(url) || fs.existsSync(url+'.ts')  || fs.existsSync(url+'.js')){
            if(packConfig.tenp.staticRequire == true){
              if(os == 'window'){
                return `require("${path.resolve(outPath, b).split(path.sep).join('\\/')}")`
              }else{
                return `require("${path.resolve(outPath, b)}")`
              }
            }else{
              return `require(process.cwd()+"/${tsconfig.compilerOptions.outDir + '/' + b}")`
            }
          }else{
            //自动引用全局或者node_modules目录下
          }
     
        }
        return a;
      })
      try {
          fd = fs.openSync(fileName, "w");
          fs.writeSync(fd, data, /*position*/ undefined, "utf8");
      }
      finally {
          if (fd !== undefined) {
              fs.closeSync(fd);
          }
      }
}






tsWatch(function(){ 


 
  process_server && process_server.kill('SIGTERM');

  setTimeout(function(){
      let env = getEnv(packConfig.tenp.env,'dev') || {};
      if(packConfig.createUrlPath == true || process.argv.indexOf('--url') != -1){
        env.createUrlPath = true;
      }
      process_server = fork('./dist/'+packConfig.main, [], { env: env })  
  }, 0)
    
}, err => {
    const text = ts.flattenDiagnosticMessageText(err.messageText, formatHost.getNewLine());
    if(packConfig.tenp.notice != false){
      sendSystemMessage('typescript编译出错', text);
    }
});

/*---------------------------全局错误监听---------------------------------*/
process.on('SIGINT', function(){
  closeNode();
})
process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack); 
  closeNode();
});

/*---------------------------关闭进程---------------------------------*/
function closeNode(){
  process_server.kill();
  process.exit()
}

/*---------------------------监听ts文件---------------------------------*/
function tsWatch(process_server, error){

  var configPath = ts.findConfigFile(

    /*searchPath*/ "./", ts.sys.fileExists, "tsconfig.json");
    if (!configPath) {
        return console.log(' tenp error: 未发现tsconfig配置文件')
    }
    var createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    var host = ts.createWatchCompilerHost(configPath, {}, ts.sys, createProgram, reportDiagnostic, reportWatchStatusChanged);
    
    var origCreateProgram = host.createProgram;

    host.createProgram = function (rootNames, options, host, oldProgram) {
        process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H')
        console.log("** 即将开始typescript文件监听! **");
        return origCreateProgram(rootNames, options, host, oldProgram);
    };

    var origPostProgramCreate = host.afterProgramCreate;

    host.afterProgramCreate = function (program) {
        console.log("** typescript文件监听已完成! **");
        origPostProgramCreate(program);
        if(process.argv.indexOf('--build') != -1){
          process.exit();
        }else{
          process_server();
        }
        
    };
    // `createWatchProgram` creates an initial program, watches files, and updates
    // the program over time.
    ts.createWatchProgram(host);

    function reportDiagnostic(diagnostic, loaderOptions, colors, compiler, merge) {

         let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
          if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
              diagnostic.start
            );
           con.error(
              `  Error ${diagnostic.file.fileName} (${line + 1},${character +
                1}): ${message}`
            );
          } else {
            con.error(`  Error: ${message}`);
          }
      
        error(diagnostic)
        console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()));
    }
    /**
     * Prints a diagnostic every time the watch status changes.
     * This is mainly for messages like "Starting compilation" or "Compilation completed".
     */
    function reportWatchStatusChanged(diagnostic) {
        console.info(ts.formatDiagnostic(diagnostic, formatHost));
    }

}



    