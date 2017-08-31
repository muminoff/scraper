'use strict';

const puppeteer = require('puppeteer');
const { URL } = require('url');

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://kun.uz', {waitUntil: 'networkidle'});
  await page.type('puppeteer');
  await page.waitForSelector('a');

  const hrefs = new Set(await page.evaluate(() => {
    const anchors = document.querySelectorAll('a');
    return [].map.call(anchors, a => a.href);
  }));

  const url = new URL(await page.url());
  let content = await page.plainText();
  content = content.replace(/(\r\n|\n|\r)/gm," ");

  const pageObject = {
    url: url.href,
    host: url.hostname,
    title: await page.title(),
    content: content,
    crawled: Date.now()
  };

  console.log(pageObject);

  browser.close();
})();
