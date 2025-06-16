import { Page } from 'puppeteer'

let $__global__$: Element | null = null
// Let's load up a cool dashboard and screenshot it!
export default async ({ page }: { page: Page }) => {
  await page.evaluateOnNewDocument(() => {
    const __USER_AGENT__ =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.85 Safari/537.36'

    // https://intoli.com/blog/making-chrome-headless-undetectable/
    // https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
      configurable: true,
      enumerable: false,
    })
    // Hide overridden properties from `Object.getOwnPropertyNames`
    const originalNavigator = { ...navigator }
    for (const key in originalNavigator) {
      if (!Object.prototype.hasOwnProperty.call(navigator, key)) {
        Object.defineProperty(navigator, key, {
          get: () => originalNavigator[key],
          configurable: true,
        })
      }
    }

    // Clean up `navigator` properties
    Object.defineProperties(navigator, {
      deviceMemory: { value: 4 },
      hardwareConcurrency: { value: 4 },
      webdriver: {
        get: () => false,
        configurable: true,
        enumerable: false,
      },
      appVersion: {
        get: () => __USER_AGENT__,
      },
      userAgent: {
        get: () => __USER_AGENT__,
      },
      userAgentData: {
        get: () => ({
          useragentVersionItems: [
            {
              brand: 'Chromium',
              version: '121.0.6167.85',
            },
            {
              brand: 'Google Chrome',
              version: '121.0.6167.85',
            },
          ],
          latestStableRelease: {
            version: '133.0.6943.35',
            date: '2025-01-29T20:53:18.537Z',
          },
        }),
      },
      languages: { get: () => ['pt-BR', 'en-US', 'en'] },
      plugins: {
        get: function () {
          const pluginData = [
            { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            {
              name: 'Microsoft Edge PDF Viewer',
              filename: 'internal-pdf-viewer',
              description: 'Portable Document Format',
            },
            { name: 'WebKit built-in PDF', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
          ]
          const pluginArray: {
            name: string
            filename: string
            description: string
          }[] = []
          pluginData.forEach(p => {
            function FakePlugin() {
              return p
            }
            const plugin = FakePlugin()
            Object.setPrototypeOf(plugin, Plugin.prototype)
            pluginArray.push(plugin)
          })
          Object.setPrototypeOf(pluginArray, PluginArray.prototype)
          return pluginArray
        },
      },
    })

    WebGLRenderingContext.prototype.getParameter = function (parameter) {
      // UNMASKED_VENDOR_WEBGL
      if (parameter === 37445) {
        // return 'Google Inc. (NVIDIA)'
        return 'Intel Open Source Technology Center'
      }
      // UNMASKED_RENDERER_WEBGL
      if (parameter === 37446) {
        // return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 (0x00002484) Direct3D11 vs_5_0 ps_5_0, D3D11)'
        return 'Mesa DRI Intel(R) Ivybridge Mobile'
      }

      return new WebGLRenderingContext().getParameter(parameter)
    }
    ;['height', 'width'].forEach(property => {
      // store the existing descriptor
      const imageDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, property)

      // redefine the property with a patched descriptor
      Object.defineProperty(HTMLImageElement.prototype, property, {
        ...imageDescriptor,
        get: function () {
          // return an arbitrary non-zero dimension if the image failed to load
          if (this.complete && this.naturalHeight === 0) return 20

          // otherwise, return the actual dimension
          return imageDescriptor?.get?.apply(this)
        },
      })
    })

    // store the existing descriptor
    const elementDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')

    // redefine the property with a patched descriptor
    Object.defineProperty(HTMLDivElement.prototype, 'offsetHeight', {
      ...elementDescriptor,
      get: function () {
        if (this.id === 'modernizr') return 1

        return elementDescriptor?.get?.apply(this)
      },
    })
  })

  await page.goto('https://www.walmart.com/ip/Annual-Event-Standard-Bundle/12941505136', { waitUntil: 'networkidle0' })
  // await simulateUserMouse()
  // await sleep(page, 100000000)

  const pxCaptchaHandle = await page.waitForSelector('#px-captcha', { visible: true })
  await page.evaluate(() => {
    const observer = new MutationObserver((mutationsList, observer) => {
      const element = document.querySelector('p[role="alert"]')
      if (element) {
        $__global__$ = element
        console.log('found', element)
        observer.disconnect() // Stop observing after finding the element
      }
    })
    // Start observing the DOM for child additions
    observer.observe(document.body, { childList: true, subtree: true })
  })

  for (const frame of page.frames()) {
    await frame.evaluate(() => {
      const observer = new MutationObserver((mutationsList, observer) => {
        const element = document.querySelector('p[role="alert"]')
        if (element) {
          $__global__$ = element
          console.log('found', element)
          observer.disconnect() // Stop observing after finding the element
        }
      })
      // Start observing the DOM for child additions
      observer.observe(document.body, { childList: true, subtree: true })
    })
  }

  const checkTryAgain = async () => {
    try {
      const val = await page.evaluate(() => $__global__$)
      console.log({ val })
      return false
    } catch (err) {
      return true
    }
  }

  let skipped = false

  const interactWithFrame = async (page, frame) => {
    if (frame.isDetached()) throw new Error('frame.isDetached')
    const _getElement = () => frame.waitForSelector('p', { visible: true, timeout: 3000 }).catch(() => null)
    const element = await _getElement()
    if (!element) throw new Error('holder target not found')

    const content = await element.evaluate(el => el.textContent)
    const foundHolder = (content ?? '').trim().toLowerCase() === 'Pressione e segure'.toLowerCase()
    if (!foundHolder) throw new Error('invalid holder')

    const box = await element.boundingBox()

    await page.mouse.move(box.x, box.y)
    await element.click()
    await page.mouse.down({ button: 'left' })
    const duration = await element.evaluate(el => {
      const computedStyle = window.getComputedStyle(el)
      // Match for time in seconds (e.g., 6.05s) or milliseconds (e.g., 6783ms)
      const animationDuration = computedStyle.animation.match(/(\d+(\.\d+)?)s|(\d+)ms/)
      const parsed = String(animationDuration ? animationDuration[1] : 7000).replace('.', '')
      const result = +parsed
      console.log(animationDuration)
      console.log({ parsed, result })
      return (result < 5000 ? result + 3000 : result) + Math.random() * 1000
    })
    await new Promise(res => setTimeout(res, Math.random() * 1000))
    await page.mouse.click(box.x, box.y, { button: 'left', delay: duration })

    await page.waitForTimeout(duration)
    await page.mouse.up()

    skipped = await checkTryAgain()
  }

  const _mainFrame = page.mainFrame()

  while (!skipped) {
    if (_mainFrame && !_mainFrame.detached) {
      await interactWithFrame(page, _mainFrame)
      console.log(skipped)

      if (skipped) return

      // await page.reload({ waitUntil: 'networkidle0' })
    } else
      for (const frame of page.frames()) {
        try {
          await interactWithFrame(page, frame)
        } catch (err) {
          console.error(err.message)
          continue
        }
        console.log(skipped)

        if (skipped) break

        // await page.reload({ waitUntil: 'networkidle0' })
      }
  }
}
