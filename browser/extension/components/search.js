function handleSearchPage() {
  setTimeout(async () => {
    insertGoogleMaterial()
    handleHeaderSearchPage()
    await handleSearchProductsCompetidor()
    handleSearchProducts()
    expandButtonSearchPage()
  }, 3000)
}

function insertGoogleMaterial() {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons'

  // Adiciona o link ao <head> do documento
  document.head.appendChild(link)
}

function expandButtonSearchPage() {
  // Seletor para a área onde o botão será adicionado
  const areaEx = document.querySelector('.sc-2a14ffd3-13.fGRmHQ')
  const existExButton = document.querySelector('#exButton')

  if (!existExButton && areaEx) {
    // Verifique se o areaEx foi encontrado
    const exButton = document.createElement('div')
    exButton.style.textAlign = 'right'
    exButton.innerHTML =
      '<button id="exButton" style="background-color: rgb(255, 255, 255); color: rgb(241, 166, 88); padding: 5px 15px; font-size: 12px; text-transform: uppercase; border: 1px solid rgb(241, 166, 88); border-radius: 5px; display: inline-block;">Expandir tudo</button>'

    // Inserir o novo botão antes de areaEx
    areaEx.parentNode.insertBefore(exButton, areaEx)

    // Adicionando eventos de mouseover e mouseout diretamente
    const button = exButton.querySelector('#exButton')

    button.addEventListener('mouseover', () => {
      button.style.filter = 'brightness(0.95)'
    })

    button.addEventListener('mouseout', () => {
      button.style.filter = 'brightness(1)'
    })

    button.addEventListener('click', () => {
      // Seletor para os elementos de produto
      const searchElements = document.querySelectorAll('.sc-aac12c5e-2.iBGjMy')
      searchElements.forEach(item => {
        const toggleButton = item.querySelector('button#contentButton')
        if (toggleButton) {
          toggleButton.click() // Simula o clique no botão
        }
      })
    })
  } else {
    console.error('Não foi possível encontrar a área de inserção ou o botão já foi adicionado.')
  }
}

function handleSearchProducts() {
  const searchElements = document.querySelector('div[data-testid="container-products"]').children

  Array.from(searchElements).forEach(item => {
    if (item.style.display === 'none') {
      item.remove()
    }
  })

  for (let item of searchElements) {
    const productId = item.getAttribute('data-item-id')

    const checkboxItem = document.createElement('input')
    checkboxItem.type = 'checkbox'
    checkboxItem.id = productId
    checkboxItem.className = 'plugin-checkbox'
    checkboxItem.style.cssText = `
            position: absolute;
            top: 3px;
            left: 3px;
            z-index: 100;
        `

    // Criação da caixa de mensagem
    const messageBox = document.createElement('div')
    messageBox.id = 'messageBox'
    messageBox.style.cssText = `
            padding: 0px 15px 15px 15px;
            border-radius: 10px;
            background-color: #fff;
            // border: 1px solid #ccc;
            // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            color: #333;
            display: none;
            width: 95%;
            align-self: center;
        `

    // Criação do botão de alternância
    const divButton = document.createElement('div')
    divButton.style.cssText = `
            width: 100%;
            text-align: center;
            pagging-top: 10px;
            padding-bottom: 10px;
        `

    const toggleButton = document.createElement('button')
    toggleButton.id = 'contentButton'
    toggleButton.innerText = '+'
    toggleButton.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: transparent; /* Fundo transparente */
            color: black; /* Cor do texto */
            font-size: 18px; /* Tamanho do texto */
            font-weight: bold; /* Negrito para o símbolo */
            border: 1px solid black; /* Borda preta */
            align-items: center;
            cursor: pointer; /* Muda o cursor para indicar interatividade */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra leve */
            transition: background-color 0.3s ease, color 0.3s ease; /* Transição suave para mudanças de cor */
        `

    toggleButton.addEventListener('mouseover', () => {
      toggleButton.style.backgroundColor = 'black' /* Fundo preto ao passar o mouse */
      toggleButton.style.color = 'white' /* Texto preto */
    })

    toggleButton.addEventListener('mouseout', () => {
      toggleButton.style.backgroundColor = 'white' /* Retorna ao fundo transparente */
      toggleButton.style.color = 'black' /* Retorna ao texto preto */
    })

    toggleButton.addEventListener('click', () => {
      if (messageBox.style.display === 'none') {
        messageBox.style.display = 'block'
        toggleButton.innerText = ''

        const icon = document.createElement('i')

        // Adiciona a classe do Material Icons
        icon.className = 'material-icons'

        // Define o texto do ícone
        icon.textContent = 'close'

        // Adiciona estilos diretamente
        icon.style.fontSize = '15px'
        icon.style.fontWeight = '800'

        toggleButton.appendChild(icon)

        chrome.runtime.sendMessage({ action: 'fetchProductInfo', productId: productId }, response => {
          if (response.error) {
            messageBox.innerHTML = `Produto não cadastrado`
          } else {
            const productInfo = response

            let priceText = getPriceSearch(item)

            if (priceText == null) {
              priceText = '0,0'
            }

            const priceValue = parseFloat(priceText.replace('R$', '').trim().replace(',', '.'))

            const lprice = productInfo.lprice || 'NaN'
            let ic = parseFloat(productInfo.ic).toFixed(2) / parseFloat(productInfo.rbv).toFixed(2) || 0
            ic = ic.toFixed(2)
            let totalS = parseFloat(productInfo.rbv) / priceValue || 'NaN'
            let todayS = formatCurrency(0)
            let weekS = formatCurrency(0)
            if (totalS != 'NaN') {
              const datatd = (totalS * priceValue) / 30
              todayS = formatCurrency(datatd)
              const dataw = (datatd * priceValue) / 4
              weekS = formatCurrency(datatd)
            }
            const datam = productInfo.rbv.replace('R$', '').trim().replace(',', '.')
            const monthS = formatCurrency(datam)

            ic = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(parseFloat(productInfo.ic.replace('R$', '').trim().replace(',', '.')))

            icc = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(parseFloat(productInfo.ic_concorrente.replace('R$', '').trim().replace(',', '.')))

            // Adiciona o conteúdo estilizado ao messageBox
            messageBox.innerHTML = `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;" onclick="var content = document.getElementById('ic-content-${productId}'); content.style.display = content.style.display === 'none' ? 'block' : 'none';">
                                <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                    <span style="width: 95%;padding-top: 3px; font-weight: 800;">
                                    Competitividade
                                    </span>
                                    <span style="width:5%; font-size: 14px !important; font-weight: 800;"> + </span>
                                </span>
                            </div>
                            <hr style="border-color: #a2a2a23b;height: 1px;margin-top: -5px;"/>
                            <div id="ic-content-${productId}" style="display: none;">
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">ssid_chart</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            IC Loja
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">${ic || 'NaN'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">ssid_chart</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            IC Concorrente
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">${icc || 'NaN'}</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;" onclick="var content = document.getElementById('vendas-content-${productId}'); content.style.display = content.style.display === 'none' ? 'block' : 'none';">
                                <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                    <span style="width: 95%;padding-top: 3px; font-weight: 800;">
                                    Vendas
                                    </span>
                                    <span style="width:5%; font-size: 14px !important; font-weight: 800;"> + </span>
                                </span>
                            </div>
                            <hr style="border-color: #a2a2a23b;height: 1px;margin-top: -5px;"/>
                            <div id="vendas-content-${productId}" style="display: none;">
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">attach_money</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Vendas hoje
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">${todayS || 'NaN'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">attach_money</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Vendas 7 dias
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">${weekS || 'NaN'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">attach_money</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Vendas mês
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">${monthS || 'NaN'}</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                    <span style="width: 40%;padding-top: 3px; font-weight: 800;">
                                    Tratativa
                                    </span>
                                    <span style="width:60%; font-size: 10px !important; font-weight: 700; text-align: right;">${productInfo.tratativa || 'Sem TratativaX'}</span>
                                </span>
                            </div>
                            <hr style="border-color: #a2a2a23b;height: 1px;margin-top: -5px;"/>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;" onclick="var content = document.getElementById('estrategia-content-${productId}'); content.style.display = content.style.display === 'none' ? 'block' : 'none';">
                                <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                    <span style="width: 95%;padding-top: 3px; font-weight: 800;">
                                    Estratégia
                                    </span>
                                    <span style="width:5%; font-size: 14px !important; font-weight: 800;"> + </span>
                                </span>
                            </div>
                            <hr style="border-color: #a2a2a23b;height: 1px;margin-top: -5px;"/>
                            <div id="estrategia-content-${productId}" style="display: none;">
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">attach_money</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Margem minima
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">${productInfo.minima || 'NaN'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">attach_money</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Posicionamento
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">${productInfo.posicao || 'NaN'}</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;" onclick="var content = document.getElementById('funil-content-${productId}'); content.style.display = content.style.display === 'none' ? 'block' : 'none';">
                                <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                    <span style="width: 95%;padding-top: 3px; font-weight: 800;">
                                    Funil de Vendas
                                    </span>
                                    <span style="width:5%; font-size: 14px !important; font-weight: 800;"> + </span>
                                </span>
                            </div>
                            <hr style="border-color: #a2a2a23b;height: 1px;margin-top: -5px;"/>
                            <div id="funil-content-${productId}" style="display: none;">
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">groups_2</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Volume de visitas
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">Integrar</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">attach_money</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Pedidos
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">${productInfo.qtd || 'NaN'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">trending_up</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Taxa de conversão
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">Integrar</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;" onclick="var content = document.getElementById('mkt-content-${productId}'); content.style.display = content.style.display === 'none' ? 'block' : 'none';">
                                <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                    <span style="width: 95%;padding-top: 3px; font-weight: 800;">
                                    Market Share
                                    </span>
                                    <span style="width:5%; font-size: 14px !important; font-weight: 800;"> + </span>
                                </span>
                            </div>
                            <hr style="border-color: #a2a2a23b;height: 1px;margin-top: -5px;"/>
                            <div id="mkt-content-${productId}" style="display: none;">
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">groups_2</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Item
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">Integrar</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; background-color:#d8d8d8; border: 1px solid #a2a2a23b; padding: 3px 3px 3px 3px;">
                                    <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                        <i class="material-icons" style="font-size: 15px !important;font-weight: 800 !important;">attach_money</i>
                                        <span style="width:12%"></span>
                                        <span style="width: 80%;padding-top: 3px;">
                                            Categoria
                                        </span>
                                    </span>
                                    <span style="text-align:end; width: 40%;font-size: 10px; font-weight: 800;padding-top: 3px;">Integrar</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: black; font-size: 10px; width: 60%; display: contents;">
                                    <span style="width: 40%;padding-top: 3px; font-weight: 800;">
                                    Auditoria
                                    </span>
                                    <span style="width:60%; font-size: 10px !important; font-weight: 700;  text-align: right;">Integrar</span>
                                </span>
                            </div>
                            <hr style="border-color: #a2a2a23b;height: 1px;margin-top: -5px;"/>
                        `
          }
        })
      } else {
        messageBox.style.display = 'none'
        toggleButton.innerText = '+'
      }
    })

    // Inserir os novos elementos no item de produto
    price = item.querySelector('.sc-713f0cf6-0.lmjPst')
    item.appendChild(checkboxItem)
    price.parentNode.insertBefore(messageBox, price)
    // item.appendChild(messageBox);
    price.parentNode.insertBefore(document.createElement('br'), price)
    // item.appendChild(document.createElement('br'));
    divButton.appendChild(toggleButton)
    price.parentNode.insertBefore(divButton, price)
    // item.appendChild(divButton);
  }
}

async function handleSearchProductsCompetidor() {
  const searchElements = document.querySelector('div[data-testid="container-products"]').children

  Array.from(searchElements).forEach(item => {
    if (item.style.display === 'none') {
      item.remove()
    }
  })

  for (let item of searchElements) {
    const additionalInfo = document.createElement('div')
    additionalInfo.style.cssText = `
           padding: 0px 15px 15px;
            width: 95%;
        `

    const productId = item.getAttribute('data-item-id')

    // Elemento do Gráfico Concorrentes
    const fristLine = document.createElement('div')
    const ficon = document.createElement('i')
    const fdescript = document.createElement('span')
    const infoKeyText = document.createElement('span')
    const infoValueText = document.createElement('span')

    fristLine.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    height: 25px;
                    background-color: #a2a2a23b;
                    border-radius: 5px;
                    padding-right: 5px;
                    padding-left: 5px;
        `

    ficon.className = 'material-icons'
    ficon.style.fontSize = '15px'
    ficon.style.fontWeight = '800'
    ficon.style.color = 'white'
    ficon.style.backgroundColor = 'gray'
    ficon.textContent = 'block'

    fdescript.style.cssText = `
                text-align: left;
                flex: auto;
                padding-left: 15px;
        `
    fdescript.innerText = ' Amazon'

    infoKeyText.appendChild(ficon)
    infoKeyText.appendChild(fdescript)
    infoKeyText.style.cssText = `
            font-size: 10px;
            font-weight: 800;
            color: black;
            display: contents;
            text-transform: capitalize;
        `
    infoValueText.innerText = '-'

    infoValueText.style.cssText = `
            font-size: 10px;
            font-weight: 800;
            color: black;
        `

    const secondLine = document.createElement('div')
    const sicon = document.createElement('i')
    const sdescript = document.createElement('span')
    const sinfoKeyText = document.createElement('span')
    const sinfoValueText = document.createElement('span')

    secondLine.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    height: 25px;
                    background-color: #a2a2a23b;
                    border-radius: 5px;
                    padding-right: 5px;
                    padding-left: 5px;
        `

    sicon.className = 'material-icons'
    sicon.style.fontSize = '15px'
    sicon.style.fontWeight = '800'
    sicon.style.color = 'white'
    sicon.style.backgroundColor = 'gray'
    sicon.textContent = 'block'

    sdescript.style.cssText = `
                text-align: left;
                flex: auto;
                padding-left: 15px;
                text-transform: capitalize;
        `
    sdescript.innerText = ' Amazon'

    sinfoKeyText.appendChild(sicon)
    sinfoKeyText.appendChild(sdescript)
    sinfoKeyText.style.cssText = `
            font-size: 10px;
            font-weight: 800;
            color: black;
            display: contents;
        `
    sinfoValueText.innerText = '-'

    sinfoValueText.style.cssText = `
            font-size: 10px;
            font-weight: 800;
            color: black;
        `

    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'fetchCompetitorInfo', productId: productId }, response => {
          if (response.error || !response) {
            reject('Erro ao obter os dados do produto')
          } else {
            resolve(response)
          }
        })
      })

      const {
        paguemenos,
        drogariaspacheco,
        panvel,
        belezanaweb,
        epocacosmeticos,
        farmaciasnissei,
        ultrafarma,
        extrafarma,
        amazon,
        drogariavenancio,
        drogariasaopaulo,
        magazineluiza,
        araujo,
      } = response

      // Mapeando as variáveis de preços
      const priceData = {
        paguemenos,
        drogariaspacheco,
        panvel,
        belezanaweb,
        epocacosmeticos,
        farmaciasnissei,
        ultrafarma,
        extrafarma,
        amazon,
        drogariavenancio,
        drogariasaopaulo,
        magazineluiza,
        araujo,
      }

      // Criação de um array com os valores convertidos para números
      const values = Object.entries(priceData).map(([key, value]) => ({
        name: key,
        value: parseFloat(value.replace(',', '.')),
      }))

      // Removendo valores inválidos (NaN)
      const filteredValues = values.filter(item => !isNaN(item.value))

      // Encontrando o maior e o menor valor, e sua origem
      const max = filteredValues.reduce((prev, current) => (prev.value > current.value ? prev : current), {})
      const min = filteredValues.reduce((prev, current) => (prev.value < current.value ? prev : current), {})

      let priceTag = getPriceSearch(item)

      if (priceTag == null) {
        priceTag = '0,0'
      }

      const price = parseFloat(priceTag.replace(/R\$|\s/g, '').replace(',', '.'))

      if (max.value == min.value && !isNaN(max.value) && !isNaN(min.value)) {
        if (max.value > price) {
          ficon.style.backgroundColor = max.value > price ? 'green' : 'red'
          ficon.textContent = 'trending_up'
          fdescript.innerText = `${max.name}`
          infoValueText.innerText = `${formatCurrency(max.value)}`
          fristLine.appendChild(infoKeyText)
          fristLine.appendChild(infoValueText)
          additionalInfo.appendChild(fristLine)
        } else {
          sicon.style.backgroundColor = min.value > price ? 'green' : 'red'
          sicon.textContent = 'trending_down'
          sdescript.innerText = `${min.name}`
          sinfoValueText.innerText = `${formatCurrency(min.value)}`
          secondLine.appendChild(sinfoKeyText)
          secondLine.appendChild(sinfoValueText)
          additionalInfo.appendChild(secondLine)
        }
      }
      // Verificando se os preços podem ser comparados
      if (!isNaN(max.value) && max.value != min.value) {
        ficon.style.backgroundColor = max.value > price ? 'green' : 'red'
        ficon.textContent = 'trending_up'
        fdescript.innerText = `${max.name}`
        infoValueText.innerText = `${formatCurrency(max.value)}`
        fristLine.appendChild(infoKeyText)
        fristLine.appendChild(infoValueText)
        additionalInfo.appendChild(fristLine)
      }

      if (!isNaN(min.value) && max.value != min.value) {
        sicon.style.backgroundColor = min.value > price ? 'green' : 'red'
        sicon.textContent = 'trending_down'
        sdescript.innerText = `${min.name}`
        sinfoValueText.innerText = `${formatCurrency(min.value)}`
        secondLine.appendChild(sinfoKeyText)
        secondLine.appendChild(sinfoValueText)
        additionalInfo.appendChild(secondLine)
      }
    } catch (e) {
      console.log('Erro ao enviar mensagem ou processar a resposta:', e)
      infoValueText.innerText = 'NaN'
    }

    price = item.querySelector('.sc-713f0cf6-0.lmjPst')
    price.parentNode.insertBefore(additionalInfo, price)
    price.parentNode.insertBefore(document.createElement('hr'), price)

    // item.appendChild(additionalInfo);
    // item.appendChild(document.createElement('hr'))
  }
}

async function handleHeaderSearchPage(category) {
  // Seleciona o h1 com o seletor fornecido
  const h1Element = document.querySelector('[data-qa="seo-search_title-h1validator"]')

  if (h1Element) {
    // Cria o container para o h1 e a nova div ficarem lado a lado
    const containerDiv = document.createElement('div')
    containerDiv.id = 'mainContainer'
    containerDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 30px;
            background-color: #d3d3d361;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding-bottom: 5px;
        `
    const brElement = document.createElement('br') // Cria um elemento <br>
    // containerDiv.parentNode.appendChild(brElement); // Adiciona o <br> após containerDiv

    // Movendo o h1 para dentro do novo container
    h1Element.parentNode.insertBefore(containerDiv, h1Element)
    containerDiv.appendChild(h1Element)

    // Cria a nova div que ficará ao lado do h1
    const has_content = document.querySelector('#contentDiv')

    if (!has_content) {
      const contentDiv = document.createElement('div')
      contentDiv.id = 'contentDiv'
      contentDiv.style.cssText = `
                margin-top: 10px;
                padding: 15px;
                font-size: 14px;
                color: #333;
                display: none;
                width: 75%;
                align-self: center;
                display: flex;
                justify-content: center;
            `

      totalProducts = document.querySelectorAll('.sc-35785f40-0.kcCeq > span').innerText

      const button = document.createElement('button')

      // const searchElements = document.querySelectorAll('.sc-aac12c5e-2.iBGjMy');
      const searchElements = document.querySelector('div[data-testid="container-products"]').children

      Array.from(searchElements).forEach(item => {
        if (item.style.display === 'none') {
          item.remove()
        }
      })

      let agg_todayS = 0
      let agg_weekS = 0
      let agg_monthS = 0
      let agg_ic = 0
      let i = 0

      for (const item of searchElements) {
        const productId = item.getAttribute('data-item-id')
        const productInfo = await new Promise(resolve => {
          chrome.runtime.sendMessage({ action: 'fetchProductInfo', productId: productId }, response => {
            resolve(response)
          })
        })

        let priceText = getPriceSearch(item)

        if (priceText == null) {
          priceText = '0,0'
        }

        const priceValue = parseFloat(priceText.replace('R$', '').trim().replace(',', '.'))

        const concorrente = parseFloat(productInfo.panvel) || NaN
        const lprice = productInfo.lprice || NaN
        const ic = productInfo.ic || NaN
        let totalS = parseFloat(productInfo.rbv) / priceValue || NaN
        let todayS = 0
        let weekS = 0

        if (totalS !== NaN) {
          todayS = parseFloat((totalS * priceValue) / 30).toFixed(2) || 0
          weekS = parseFloat((totalS * priceValue) / 4).toFixed(2) || 0
        }

        const monthS = !isNaN(parseFloat(productInfo.rbv)) ? parseFloat(productInfo.rbv) : 0

        if (!isNaN(todayS)) agg_todayS += parseFloat(todayS)
        if (!isNaN(weekS)) agg_weekS += parseFloat(weekS)
        if (!isNaN(monthS)) agg_monthS += parseFloat(monthS)
        if (!isNaN(ic)) agg_ic += parseFloat(ic)
        i++
      }

      contentDiv.innerHTML = `
                    <div style="width:13.28%; height:100px; padding: 15px;border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">loyalty</i><br><span style="font-size: 9px; color: gray;">Produtos</span><br><br><span style="font-size: 10px;font-weight: 800;">${i}</span></div>
                    <div style="width:13.28%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;color: white;background-color: green;">ssid_chart</i><br><span style="font-size: 9px; color: gray;">IC</span><br><br><span style="font-size: 10px;font-weight: 800;">${agg_ic}</span></div>
                    <div style="width:13.28%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">attach_money</i><br><span style="font-size: 9px; color: gray;">Vendas hoje</span><br><br><span style="font-size: 10px;font-weight: 800;">${formatCurrency(agg_todayS)}</span></div>
                    <div style="width:13.28%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">attach_money</i><br><span style="font-size: 9px; color: gray;">Vendas S-1</span><br><br><span style="font-size: 10px;font-weight: 800;">${formatCurrency(agg_weekS)}</span></div>
                    <div style="width:13.28%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">attach_money</i><br><span style="font-size: 9px; color: gray;">Vendas mês</span><br><br><span style="font-size: 10px;font-weight: 800;">${formatCurrency(agg_monthS)}</span></div>
                    <div style="width:13.28%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">groups_2</i><br><span style="font-size: 9px; color: gray;">Volume de visitas</span><br><br><span style="font-size: 10px;font-weight: 800;">${'Integrar'}</span></div>
                    <div style="width:13.28%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">trending_up</i><br><span style="font-size: 9px; color: gray;">Taxa de conversão</span><br><br><span style="font-size: 10px;font-weight: 800;">${'Integrar'}</span></div>
                `

      contentDiv.innerHTML += `
                    <div style="width:7%;">
                        <button 
                            id="botaoEditar" 
                            style="height:100px; padding: 15px; margin-left:10px; border-radius: 10px; background-color: #FFF; border: 1px solid rgb(204, 204, 204); box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px; color: rgb(51, 51, 51); align-self: center; display: block; text-align: center; overflow-wrap: break-word;" 
                            onmouseover="this.style.backgroundColor='rgb(0,97,114)'; this.style.color='white';" 
                            onmouseout="this.style.backgroundColor='white'; this.style.color='black';" 
                            onclick="const editContent = document.querySelector('#editContent'); if (editContent) { editContent.style.display = editContent.style.display === 'none' ? 'block' : 'none'; } else { console.error('Div com id \\'editContent\\' não encontrada!'); }">
                            <i class="material-icons" style="font-size: 25px !important; font-weight: 800 !important;">edit</i>
                            <br><br>
                            <span style="font-size: 10px;font-weight: 800;">Editar Valores</span>
                        </button>
                    </div>
                `

      const buttonScript = document.createElement('script')
      buttonScript.type = 'text/javascript'

      buttonScript.innerHTML = `function toggleEditContent() {
                const editContent = document.querySelector('#editContent'); // Certifique-se de que a div com id "editContent" existe
                if (editContent) {
                    editContent.style.display = editContent.style.display === 'none' ? 'block' : 'none';
                } else {
                    console.error('Div com id "editContent" não encontrada!');
                }
            }`

      const editContent = document.createElement('div')
      editContent.id = 'editContent'
      editContent.style.cssText = `
                text-align: right;
                background-color: #d3d3d361;
                height: 50px;
                padding: 15px 15px 0px 15px;
                display: none;
            `

      editButton = document.createElement('button')
      editToogle = document.createElement('input')
      editText = document.createElement('span')

      editButton.innerText = 'Edite em massa'
      editButton.disabled = true
      editText.innerText = 'selecione aqui'
      editText.id = 'infoTextPlugin'
      editText.style.cssText = `
                padding-left: 15px;
                padding-right: 35px;
                width: 20%;
            `

      editToogle.type = 'checkbox'

      editToogle.addEventListener('change', () => {
        editButton.disabled = !editToogle.checked
        const checkboxList = document.querySelectorAll('.plugin-checkbox')
        checkboxList.forEach(item => {
          item.checked = editToogle.checked
        })
        const infoTextPlugin = document.querySelector('#infoTextPlugin')
        if (editToogle.checked) {
          infoTextPlugin.innerText = `${checkboxList.length} itens selecionados`
        } else {
          infoTextPlugin.innerText = `Não há itens selecionados`
        }
      })

      editButton.addEventListener('click', () => {
        updateInterface()
      })

      editContent.appendChild(editToogle)
      editContent.appendChild(editText)
      editContent.appendChild(editButton)

      // Localizar a Div do H1
      // const headerContent = document.querySelector('#contentDiv');
      // headerContent.appendChild(editContent);

      // contentDiv.appendChild(button);
      // Insere a nova div dentro do container ao lado do h1
      containerDiv.appendChild(contentDiv)
    }
  } else {
    console.log('Elemento h1 não encontrado.')
  }
}

function getPriceSearch(item) {
  const selectors = ['.sc-893b29e9-0.hUuLwk', '.sc-24575961-0.iuEYem']

  for (const selector of selectors) {
    const element = item.querySelector(selector)
    if (element) {
      return element.innerText || element.innerHTML
    }
  }

  return null
}
