function checkUrlAndExecute() {
  const currentUrl = window.location.href
  const cleanUrl = extractPathFromUrl(currentUrl)

  // Verifica se cleanUrl é nulo ou vazio
  if (!cleanUrl) {
    console.log('URL sem caminho, apenas o domínio.')
    return
  }

  // Caso contenha "search"
  if (cleanUrl.includes('search')) {
    handleSearchPage()
  }

  // Divide o cleanUrl pelo "/"
  const pathParts = cleanUrl.split('/').filter(Boolean) // Filtra strings vazias

  // Se tiver apenas um elemento após o split
  if (pathParts.length === 1) {
    const elemento = document.querySelector('div[data-qa="container_category"]')
    if (elemento) {
      handleCategoryPage()
    } else {
      handleProductPage()
    }
  }
  // Se tiver mais de um elemento, passa o vetor de resultados
  else if (pathParts.length > 1) {
    handleCategoryPage()
  }
}
