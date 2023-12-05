const puppeteer = require('puppeteer');

// starting Puppeteer

let retry = 0;
let maxRetries = 5;

(async function scrape() {
    retry++;

    let proxyList = [
        '202.131.234.142:39330',
        '45.235.216.112:8080',
        '129.146.249.135:80',
        '148.251.20.79'
    ];

    var proxy = proxyList[Math.floor(Math.random() * proxyList.length)];

    console.log('proxy: ' + proxy);

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server=' + proxy]
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');

        await page.goto('https://quotes.toscrape.com/search.aspx');

        await page.waitForSelector('select#author');
        await page.select('select#author', 'Albert Einstein');

        // await page.waitForSelector('#tag');
        // await page.select('select#tag', 'learning');

        // await page.click('.btn');
        // await page.waitForSelector('.quote');

        // extracting information from code
        let quotes = await page.evaluate(() => {

            let quotesElement = document.body.querySelectorAll('.quote');
            let quotes = Object.values(quotesElement).map(x => {
                return {
                    author: x.querySelector('.author').textContent ?? null,
                    quote: x.querySelector('.content').textContent ?? null,
                    tag: x.querySelector('.tag').textContent ?? null,

                }
            });

            return quotes;

        });

        console.log(quotes);

        await browser.close();
    } catch (e) {

        await browser.close();

        if (retry < maxRetries) {
            scrape();
        }
    }
})();
