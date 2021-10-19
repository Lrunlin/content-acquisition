const { inquiry, rl } = require("./inquiry");
const axios = require("axios");
const cheerio = require("cheerio");

const optionList = async () => {
  let typeMessage = ""; //获取tag之后拼接
  let tagStringData =
    (await axios.get("https://segmentfault.com/tags")).data +
    (await axios.get("https://segmentfault.com/tags?sort=hottest&page=2")).data;
  let typeTag = [];
  let tag1Dom = cheerio.load(tagStringData);
  tag1Dom(".badge-tag.mb-2").each((index, item) => {
    typeTag.push({
      index: index,
      label: tag1Dom(item).text(),
      href: decodeURI(tag1Dom(item).attr("href")).replace("/t/", ""),
    });
  });

  typeTag.forEach(item => {
    typeMessage += `${item.index}.${item.label}\n`;
  });
  let number = await inquiry("抓取文章数量?(number)");
  let image = await inquiry("是否允许包含图片？（Y/N）");
  let time = await inquiry("是否只要三年之内的文章？（Y/N）");
  let keyword = await inquiry("文章要求必须有某个关键字？（string/N）");
  let prohibited = await inquiry("文章禁止包含某个关键词？（string/N）");
  let a = await inquiry("是否允许包含超链接？（Y/N）");
  let type = await inquiry(`选择查询的文章类型（输入序号）\n ${typeMessage}`);

  let typeResult = typeTag.find(item => item.index == type);
  type = typeResult?.href || "javascript";

  rl.close();
  let option = {
    number,
    image,
    time,
    keyword,
    prohibited,
    a,
    type,
  };

  let test = /^[\s\S]*.*[^\s][\s\S]*$/;
  //默认
  // {
  //     number: 10,
  //     image: false,
  //     time: false,
  //     keyword: false,
  //     prohibited: false,
  //     a: false
  //     type:javascript
  // }
  let optionSwitch = {
    number: value => (isNaN(+value) || +value < 1 ? 10 : +value), //如果输入错误默认为10
    image: value => value.toLowerCase() == "y",
    time: value => value.toLowerCase() == "y",
    keyword: value => (value.toLowerCase() == "n" || !test.test(value) ? false : value),
    prohibited: value => (value.toLowerCase() == "n" || !test.test(value) ? false : value),
    a: value => value.toLowerCase() == "y",
    type: value => value,
  };
  for (const key in option) {
    const item = option[key];
    option[key] = optionSwitch[key](item);
  }
  return option;
};

module.exports = optionList;
