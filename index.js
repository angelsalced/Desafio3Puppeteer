const puppetter = require("puppeteer")

async function pruebaNavegador() {
    
    const browser = await puppetter.launch({headless: false,slowMo:500 })
    const page = await browser.newPage()
    await page.goto('http://example.com')
    await page.waitForSelector('h1')
    await browser.close()
}

pruebaNavegador()
