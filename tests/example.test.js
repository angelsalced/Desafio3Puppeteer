    const puppeteer = require('puppeteer')
    const assert = require('assert')

    describe('Prueba Lista y Carrito GAP', () => {    
        it('Prueba Precios Coincidentes', async () => {
            const browser = await puppeteer.launch({ headless: true,//slowMo: 500,
                args: ['--start-maximized'],defaultViewport: {
                width: 1920,
                height: 1080
            }})
            const page = await browser.newPage()
            await page.goto('https://www.gap.com.mx/tienda/home')
            await page.waitForSelector('#__next > main > header > div.o-header > div.o-container__fluid.container-fluid.d-none.d-lg-block.c-megaMenu > div > div > ul > li:nth-child(1) > a')
            const modulo = await page.$('#__next > main > header > div.o-header > div.o-container__fluid.container-fluid.d-none.d-lg-block.c-megaMenu > div > div > ul > li:nth-child(1) > a')

            const moduloText = await page.evaluate(anchor => anchor.textContent, modulo)
            if (moduloText =='Mujer') {
                await modulo.hover()
            }  else {
                throw new Error(`El enlace no contiene el texto esperado. Se encontró: "${moduloText}".`)
            }

            await page.waitForSelector('#CATST19116878 > div > div.row.align-items-top > div > div > div:nth-child(1) > a')
            const prenda = await page.$(`#CATST19116878 > div > div.row.align-items-top > div > div > div:nth-child(1) > a`)

            await prenda.hover()
            await prenda.click()

            await page.waitForSelector('#__next > main > div.min-vh-100.behind-overlay > div.container-fluid.o-main-container.p-0.o-plp-secondaryContainer > div > div.row.mt-lg-3.m-row-bootstrap > main > div:nth-child(2) > div > div > ul > li:nth-child(1) > a > div')
            const sudadera = await page.$('#__next > main > div.min-vh-100.behind-overlay > div.container-fluid.o-main-container.p-0.o-plp-secondaryContainer > div > div.row.mt-lg-3.m-row-bootstrap > main > div:nth-child(2) > div > div > ul > li:nth-child(1) > a > div')
            await sudadera.click()

            await page.waitForSelector('#size-list-container > li:nth-child(3) > button')
            const talla = await page.$('#size-list-container > li:nth-child(3) > button')
            await talla.click()

            const selecPrecioLista = await page.$('#__next > main > div.min-vh-100 > section.o-product__detail > div > main > div.o-product__description.false > div.m-product__price-dw-promotion > div > div > div > p.a-product__paragraphDiscountPrice.m-0.d-inline')
            const precioListaTexto = await page.evaluate(anchor => anchor.textContent, selecPrecioLista)
            const precioListaEntero = parseInt(precioListaTexto.replace('$', '').replace(',', ''), 10)
            const precioLista = (precioListaEntero / 100).toFixed(2)
        
            console.log(`El precio en lista es: ${precioLista}`)

            await page.waitForSelector('#opc_pdp_addCartButton')
            const agregarBolsa = await page.$('#opc_pdp_addCartButton')
            await agregarBolsa.click()

            
            await page.waitForSelector('#__next > main > div.min-vh-100 > div.m-alert__container.mdc-snackbar.-success > div > div.m-mdc__snackbarLabel.mdc-snackbar__label')

            await page.goto('https://www.gap.com.mx/tienda/cart')
            await page.waitForSelector('#\\31 158399616 > div:nth-child(2) > div.o-myBag__column--priceContainer.undefined > p')

            const selecPrecioCarrito = await page.$('#\\31 158399616 > div:nth-child(2) > div.o-myBag__column--priceContainer.undefined > p')
            const precioCarritoTexto = await page.evaluate(anchor => anchor.textContent, selecPrecioCarrito)
            const precioCarritoEntero = parseInt(precioCarritoTexto.replace('$', '').replace(',', ''), 10)
            const precioCarrito = (precioCarritoEntero / 100).toFixed(2)
        
            console.log(`El precio en carrito es: ${precioCarrito}`)

            assert.strictEqual(precioLista, precioCarrito, `El precio no coincide: ${precioLista} !== ${precioCarrito}`)

            console.log('Los precios coinciden.')


           await browser.close()

        })
    })