function extractDomainFromUrl(text) {
  // Expressão regular para validar e capturar a URL
  const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})?/

  const match = text.match(urlPattern)

  if (match) {
    // Retorna apenas o domínio sem o TLD
    return match[3] // Retorna apenas o domínio
  }

  return null // Retorna null se não for uma URL válida
}

function extractPathFromUrl(url) {
  // Regex para capturar o caminho, ignorando o domínio e removendo a extensão do arquivo
  const pathPattern = /https?:\/\/(?:www\.)?[^\/]+\/([^\?#]+)(?=\.[a-zA-Z]+)?/

  const match = url.match(pathPattern)

  if (match) {
    return match[1] // Retorna o caminho sem o domínio e sem a extensão
  }

  return null // Retorna null se não for uma URL válida
}
