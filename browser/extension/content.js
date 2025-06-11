checkUrlAndExecute()

let lastUrl = window.location.href

const originalPushState = history.pushState
const originalReplaceState = history.replaceState

history.pushState = function (...args) {
  originalPushState.apply(this, args)
  onUrlChange()
}

history.replaceState = function (...args) {
  originalReplaceState.apply(this, args)
  onUrlChange()
}

window.addEventListener('popstate', onUrlChange)

window.addEventListener('popstate', function (event) {
  location.reload()
})

function onUrlChange() {
  const currentUrl = window.location.href
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl
    checkUrlAndExecute()
  }
}

function checkUrlPeriodically() {
  const currentUrl = window.location.href
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl
    console.log(`URl alterou ${currentUrl}, ${lastUrl}`)
    window.location.reload()
  }
}

setInterval(checkUrlPeriodically, 1000)
