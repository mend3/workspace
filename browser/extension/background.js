chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchProductInfo') {
    const productId = request.productId

    fetch(`http://localhost:3000/api/produtos/${productId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        sendResponse(data)
      })
      .catch(error => {
        sendResponse({ error: error.message })
      })

    return true
  }

  if (request.action === 'fetchCompetitorInfo') {
    const productId = request.productId

    fetch(`http://localhost:3000/api/concorrente/${productId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        sendResponse(data)
      })
      .catch(error => {
        sendResponse({ error: error.message })
      })

    return true
  }

  if (request.action === 'fetchCategoryInfo') {
    const productId = request.productId

    fetch(`http://localhost:3000/api/categoria/${productId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        sendResponse(data)
      })
      .catch(error => {
        sendResponse({ error: error.message })
      })

    return true
  }
})
