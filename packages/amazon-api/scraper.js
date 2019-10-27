const puppeteer = require('puppeteer')

const amazonURL = 'https://www.amazon.co.uk/'

const options = {
    ignoreDefaultArgs: ['--disable-extensions', '--no-sandbox', '--disable-setuid-sandbox'],
}

/**
 * crawl through each href link on page
 */
async function crawlHrefs(page, elementHandles) {
    const propertyJsHandles = await Promise.all(
        elementHandles.map(async handle => {
            const dealImages = await handle.$$('#dealImage')
            const dealImage = dealImages[0]
            const dealPriceTexts = await handle.$$('.dealPriceText')
            const dealPriceText = dealPriceTexts[0]
            console.log('DEAL IMAGE ', dealImage)
            console.log('DEAL PRICE TEXT ', dealPriceText)

            const href = await dealImage.getProperty('href')
            console.log('HREF ', href)
            const imagesInElement = await handle.$$('img')
            console.log(imagesInElement.length)
            const imgSrc = imagesInElement[0].getProperty('src')
            console.log('IMGSRC ', imgSrc)
            const price = dealPriceText.innerHTML
            console.log('PRICE ', price)

            return {
                href,
                imgSrc,
                price,
            }
        }),
    )
    console.log(propertyJsHandles)
    let hrefs = await Promise.all(
        propertyJsHandles.map(handle => handle.jsonValue()),
    )
    hrefs = hrefs.filter(href => !['apb', 'deal', 's'].includes(href.split('amazon.co.uk/')[1].split('/')[0]))
    hrefs = hrefs.filter(href => href.split('amazon.co.uk/')[1].split('/')[0].indexOf('ref=') === -1)
    console.log(hrefs)
}

async function getDeals(page) {
    const todaysDeals = 'gp/deals'

    await page.goto(`${amazonURL}${todaysDeals}`)

    const dealTiles = await page.$$('.dealTile')

    // const elementHandles = await page.$$('a')
    await crawlHrefs(page, dealTiles)
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

launchBrowser()
