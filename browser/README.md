# Puppeteer-Extra Wiki

[Puppeteer vs Playwright](https://github.com/berstend/puppeteer-extra/wiki/Playwright-vs-Puppeteer#tldr---which-one-should-i-use)

[Common stealth issues](https://github.com/berstend/puppeteer-extra/wiki/Common-stealth-issues)

Welcome to the puppeteer-extra wiki! This is where you can find some useful guides around topics concerning the `Extra` lib, `Puppeteer`, and other scraping related issues.

This wiki is open for general contribution, so if you've benefited from the community and have knowledge to share we encourage you to contribute!

## Contents

### 📖 Guides

- [Playwright vs Puppeteer](https://github.com/berstend/puppeteer-extra/wiki/Playwright-vs-Puppeteer)
- [Common Stealth Issues](https://github.com/berstend/puppeteer-extra/wiki/Common-stealth-issues)
- [How to debug puppeteer and headless browsers](https://github.com/berstend/puppeteer-extra/wiki/How-to-debug-puppeteer-and-headless-browsers)
- [Using Google Chrome instead of Chromium](https://github.com/berstend/puppeteer-extra/wiki/Using-Google-Chrome-instead-of-Chromium)
- [Blocking Resources](https://github.com/berstend/puppeteer-extra/wiki/Block-resources-without-request-interception)
- [Scraping Terminology](https://github.com/berstend/puppeteer-extra/wiki/Terminology)
- [Chrome Launch Arguments](https://github.com/berstend/puppeteer-extra/wiki/Chrome-launch-arguments)
- [Using proxies](https://github.com/berstend/puppeteer-extra/wiki/Using-proxies)
- [What language should I use to build my bot?](https://github.com/berstend/puppeteer-extra/wiki/What-language-should-I-use-to-build-my-bot%3F)

### 👨‍🏫 Newbies

- [Newbie Guide To Scraping With Puppeteer](https://github.com/berstend/puppeteer-extra/wiki/Newbie-Guide-To-Scraping-With-Puppeteer)
- [Newbie Puppeteer Starter Kit](https://github.com/prescience-data/foundation)

### 🧠 Advanced

- [Dark Knowledge - Curated Anti-Detect Research Papers](https://github.com/prescience-data/dark-knowledge)

### 🎉 Community

- [Community Discord Server](https://github.com/berstend/puppeteer-extra/wiki/Scraping-Chat)  
  ![Discord](https://img.shields.io/discord/737009125862408274)

### 🧰 Third-Party Tools

- [List Of Proxy Services](https://github.com/berstend/puppeteer-extra/wiki/Proxy-services)

### 💬 Contributing

- [Formatting / TypeScript](https://github.com/berstend/puppeteer-extra/wiki/TypeScript-usage)

### Plugin frameworks

- [playwright-extra](https://github.com/berstend/puppeteer-extra/tree/master/packages/playwright-extra)
- [puppeteer-extra](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra)

## Browser use

```txt
Usage: browser-use [OPTIONS]

  Browser-Use Interactive TUI or Command Line Executor

  Use --user-data-dir to specify a local Chrome profile directory. Common
  Chrome profile locations:   macOS: ~/Library/Application
  Support/Google/Chrome   Linux: ~/.config/google-chrome   Windows:
  %LOCALAPPDATA%\Google\Chrome\User Data

  Use --profile-directory to specify which profile within the user data
  directory. Examples: "Default", "Profile 1", "Profile 2", etc.

Options:
  --version                 Print version and exit
  --model TEXT              Model to use (e.g., gpt-4o,
                            claude-3-opus-20240229, gemini-pro)
  --debug                   Enable verbose startup logging
  --headless                Run browser in headless mode
  --window-width INTEGER    Browser window width
  --window-height INTEGER   Browser window height
  --user-data-dir TEXT      Path to Chrome user data directory (e.g.,
                            ~/Library/Application Support/Google/Chrome)
  --profile-directory TEXT  Chrome profile directory name (e.g., "Default",
                            "Profile 1")
  --cdp-url TEXT            Connect to existing Chrome via CDP URL (e.g.,
                            http://localhost:9222)
  -p, --prompt TEXT         Run a single task without the TUI (headless mode)
  --help                    Show this message and exit.
```
