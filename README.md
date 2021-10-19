# 说明

Node.js爬虫,程序为思否社区的文章爬取,使用 Node.js 程序编写需要依靠 puppeteer 和 cheerio,使用 puppeteer 通过浏览器模拟用户行为可以防止访问速度过快而遭到限流或者验证

## 功能

程序运行后会在控制台询问您以下配置

1. 设置文章抓取个数(number)
2. 选择是否允许包含图片(image)
3. 选择文章时间是否只要求三年之内(time)
4. 设置文章关键词,所有被抓取的文章必要包含本关键词(keyword)
5. 设置文章禁用词,不收录包含本词汇的文章(prohibited)
6. 选择是否允许包含超链接(a)
7. 选择文章类型(type)

## 运行

1. 安装依赖 yarn/npm i
2. yarn start/npm run start

## 抓取文章格式

1. title {string} 标题
2. html {string} 文章主体内容
3. type {string[]} 文章类型
4. time {Date} 文章发布时间（UTC）

## 代码运行流程

1. 使用 axios 请求类型页面后使用 cheerio 处理为数组
2. 获取使用者在控制台输入的配置并转换
3. 通过配置中的 type 获取对应文章的目录
4. 循环目录中的地址并获取文章信息
5. 检测是否符合用户输入配置的要求
6. 存入数组
7. 检测长度是否到用户的 number

# [BLOG](https://blogweb.cn)
