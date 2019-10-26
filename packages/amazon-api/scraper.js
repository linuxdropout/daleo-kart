const puppeteer = require('puppeteer')

const amazonURL = 'https://www.amazon.co.uk/'
const xmasEdition = 'gcx/Gifts-for-Everyone/gfhz/ref=dk_cs_christmas_19'

const options = {
    ignoreDefaultArgs: ['--disable-extensions', '--no-sandbox', '--disable-setuid-sandbox'],
}

async function launchBrowser() {
    try {
        const browser = await puppeteer.launch(options)
        const [page] = await browser.pages()

        await page.goto(`${amazonURL}${xmasEdition}`)
        await crawl(page)
        await browser.close()
    } catch (err) {
        console.error(err)
    }
}

/**
 * crawl through each href link on page
 */
async function crawl(page) {
    const elementHandles = await page.$$('a')
    const propertyJsHandles = await Promise.all(
        elementHandles.map(handle => handle.getProperty('href')),
    )
    const hrefs = await Promise.all(
        propertyJsHandles.map(handle => handle.jsonValue()),
    )

    console.log(hrefs)
}

/**
 * save URL and .jpegs as json
 * { id: { url: link, photo: jpg }
 * }
 */
function saveLink() {

}

launchBrowser()
