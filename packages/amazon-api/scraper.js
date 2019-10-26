const puppeteer = require('puppeteer')

const amazonURL = 'https://www.amazon.co.uk/'

const options = {
    ignoreDefaultArgs: ['--disable-extensions', '--no-sandbox', '--disable-setuid-sandbox'],
}

async function launchBrowser() {
    try {
        const browser = await puppeteer.launch(options)
        const [page] = await browser.pages()
        await page.goto(amazonURL)

        await getDeals(page)

        await browser.close()
    } catch (err) {
        console.error(err)
    }
}

/**
 * crawl through each href link on page
 */
async function crawlHrefs(page, elementHandles) {
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


async function getDeals(page) {
    const todaysDeals = 'gp/deals'
    const elementId = 'data-infinite-scroll'
    const productItems = '[data-test=product]'
    const productPrice = '[data-test=price]'

    await page.goto(`${amazonURL}${todaysDeals}`)

    const handles = await page.$$('#dealImage')

    const elementHandles = await page.$$('a')
    await crawlHrefs(page, elementHandles)
}

launchBrowser()
