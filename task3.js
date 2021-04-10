const puppeteer = require('puppeteer');
const json2csv = require("json2csv").Parser;
const fs = require("fs");

Url = "https://scrapethissite.com/pages/ajax-javascript/?fbclid=IwAR3TTyNT39V8BwcjA4nrKeVv748Oaw_bPHoICE3a8UAyXPAeR0EWL9HIifU";


async function click(button) {
    await button.evaluate(button => button.click());
}

(async () => {

    let data = [];

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    data = [];
    let i = 0;

    const j2cp = new json2csv();

    while (i < 6) {
        const page = await browser.newPage();

        page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36");
        await page.goto(Url);

        await page.waitForSelector('a[class="year-link"]');

        const button = await page.$x('//a[@class="year-link"]');

        await click(button[i]);

        pages = await page.waitForSelector("#table-body > tr");
        const result = await page.$$eval("#table-body > tr", rows => {

            return rows.map(row => {
                const details = {};
                const title = row.querySelector('td.film-title');
                details.Title = title.innerText;

                const nomination = row.querySelector('td.film-nominations')
                details.Nominations = nomination.innerText;

                const awards = row.querySelector('td.film-awards');
                details.Awards = awards.innerText;

                return details;

            })
        });

        console.log(result);

        const csv = j2cp.parse(result);
        fs.appendFileSync("./Team Info.csv", csv, "utf-8")
        i++;
    }


})();