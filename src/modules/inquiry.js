/*
  todo 控制台询问用户配置并获取答案
  @param {string} str 询问的问题
  @return {string} value 答案
*/
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function inquiry(str) {
    let p = new Promise((seccess) => {
        rl.question(str, (answer) => {
            seccess(answer)
        });
    })
    return p;
};

//?导出使用和关闭
module.exports = {
    rl,
    inquiry
}