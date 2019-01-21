
const path = require('path');
const { spawn } = require('child_process')
const fs = require('fs');
const npm_cmd = process.platform === "win32" ? "npm.cmd" : "npm";


module.exports = function installDependencies( url, color) {

  if(!fs.existsSync(url)){
    console.log('\n $ 目录不存在')
    return console.log('');
  }
  console.log(`\n $ 开始安装依赖包·························`)
  console.log(' $ ========================\n')
  return new Promise((resolve, reject) => {
    const spwan = spawn(npm_cmd, ['install'], {
      cwd: url,
      stdio: 'inherit',
      shell: true,
    })
    spwan.on('exit', () => {
      resolve()
    })
  })
}

// module.exports.Global_DevDependencies = function(){

//   return new Promise((resolve, reject) => {
//     const spwan = spwan(,'',[], {
//       cwd: path.resolve(__dirname,'../'),
//       stdio: 'inherit',
//       shell: true,
//     })
//   })

// }