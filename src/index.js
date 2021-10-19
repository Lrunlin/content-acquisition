const puppeteer = require("puppeteer");
const fs = require("fs");
const optionList = require('./modules/optionList'); //获取用户配置
const qualified = require('./modules/qualified'); //判断是否符合要求
let data = []; //文章数据
let nowPage = 1; //当前页数


(async () => {
  const option = await optionList(); //用户配置


  console.log('开始运行');
  console.log(option);


  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 100,
    // devtools: true
    defaultViewport: {
      width: 1200,
      height: 800,
    },
  });
  const page = await browser.newPage();

  /*
  todo 获取当前页数的文章目录
  @param {number} page 需要获取的页数
  @return {number[]} href 当前页数的文章目录
  */
  async function getPage(nowPage) {
    await page.goto(`https://segmentfault.com/t/${option.type}/blogs?page=${nowPage}`, {
      timeout: 10000 * 60,
    });
    let href = await page.$$eval(".title.text-body", el => {
      return el.map((item) => {
        return item.href;
      });
    });
    return href;
  }

  /*
  todo 根据链接获取对应文章的具体数据
  @param {string} href 需要被查询的文章
  @return {object} data 对应文章信息
  */
  async function getData(href) {
    console.log(`页数:${nowPage},已有:${data.length},链接：${href}`);
    let articleData = {};

    try {
      await page.goto(href, {
        timeout: 10000 * 60,
      });
      let title = await page.$eval("h1.h2.mb-3", (el) => el.innerText); //文章标题
      let html = await page.$eval(
        "article.article.article-content",
        (el) => el.innerHTML
      ); //文章内容
      let type = await page.$$eval(".badge-tag ", (el) => {
        return el.map((item) => {
          return item.innerText;
        });
      });
      let time = await page.$eval(
        ".text-secondary time",
        (el) => el.getAttribute('datetime')
      );

      articleData = {
        title,
        html,
        type,
        time,
        href
      };
    } catch (error) {
      console.log(error);
      //切换页面错误
    }
    return articleData;
  }

  function print() {
    fs.writeFileSync("./article.json", JSON.stringify({
      time: new Date(),
      option,
      data
    }));
    page.close();
  }

  async function collectData() {
    let pageData = await getPage(nowPage);
    console.log(`第${nowPage}页开始`);
    for (var index = 0; index < pageData.length; index++) {
      const item = pageData[index];

      //换页(页码加一，重复执行该函数)
      if (index == pageData.length - 1) {
        nowPage++;
        collectData();
        return false;
      }
      const articleData = await getData(item);
      if (qualified(articleData, option)) {
        data.push(articleData);
        if (data.length == option.number) {
          print()
          process.exit(1)
        };
      }
    }
  }
  collectData();
})();