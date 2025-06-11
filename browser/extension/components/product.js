function handleProductPage() {
  setTimeout(() => {
    insertGoogleMaterial()

    const productId = document.querySelector(
      '#__next > main > div.RaiaProductDescriptionstyles__Global-sc-1ijezxr-0.jsOYDY.rd-container > div > div > div:nth-child(1) > span.RaiaProductDescriptionstyles__Data-sc-1ijezxr-8.fTuOFQ > div',
    ).innerText

    headerProductInfo(productId)
  }, 5000)
}

function insertGoogleMaterial() {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons'

  // Adiciona o link ao <head> do documento
  document.head.appendChild(link)
}

function headerProductInfo(productId) {
  const headerProduct = document.querySelector('#__next > main > div:nth-child(2)')

  if (headerProduct) {
    // Cria a nova div que ficará ao lado do h1
    const contentDiv = document.createElement('div')
    contentDiv.style.cssText = `
            margin-top: 10px;
            padding: 15px;
            border-radius: 3px;
            background-color: #d3d3d361;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            color: #333;
            display: none;
            width: 100%;
            align-self: center;
            display: flex;
            justify-content: center;
        `

    chrome.runtime.sendMessage({ action: 'fetchProductInfo', productId: productId }, response => {
      const categoryInfo = response

      let concorrente = 'Sem Dados'
      let lprice = 'Sem Dados'
      let ic = 'Sem Dados'
      let todayS = 'Sem Dados'
      let weekS = 'Sem Dados'
      let monthS = 'Sem Dados'
      let dtInicio = 'Sem Dados'
      let dtFim = 'Sem Dados'
      let color = 'gray'
      let thrend = 'trending_up'

      if (!categoryInfo.error) {
        const priceText = document.querySelector(
          '#__next > main > div:nth-child(3) > div > div.TwoColumnsstyles__SecondColumnStyles-sc-46q9v-1.gISnij.rd-col-7 > div > div.ProductPageRaiastyles__PriceContainer-sc-1mwseac-4.gWicpg > div.price-and-tag > div.ProductPricestyles__Container-sc-1fizsje-0.ipdflv > span.ProductPricestyles__Price-sc-1fizsje-4.fHTFqL',
        ).innerText
        const priceValue = parseFloat(priceText.replace('R$', '').trim().replace(',', '.'))

        concorrente = parseFloat(categoryInfo.panvel) || 'Sem Preço'
        lprice =
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(parseFloat(categoryInfo.lprice.replace('R$', '').trim().replace(',', '.'))) || 'NaN'
        ic = parseFloat(categoryInfo.ic).toFixed(2) / parseFloat(categoryInfo.rbv).toFixed(2) || 0
        ic = ic.toFixed(2)
        totalS = parseFloat(categoryInfo.rbv) / priceValue || 0
        todayS = 0
        weekS = 0
        if (totalS != 'NaN') {
          todayS = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(parseFloat((totalS * priceValue) / 30).toFixed(2))
          weekS = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(parseFloat((totalS * priceValue) / 4).toFixed(2))
        }
        const monthS = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(parseFloat(categoryInfo.rbv.replace('R$', '').trim().replace(',', '.')))

        if (concorrente != 'Sem Preço') {
          if (priceValue > concorrente) {
            color = 'red'
            thrend = 'trending_down'
          }
          if (priceValue < concorrente) {
            color = 'green'
            thrend = 'trending_up'
          }

          concorrente = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(parseFloat(concorrente).toFixed(2))
        }

        const dtInicio = isNaN(new Date(categoryInfo.dtInicio))
          ? 'Não Consta'
          : new Date(categoryInfo.dtInicio).toLocaleDateString('pt-BR')

        const dtFim = isNaN(new Date(categoryInfo.dtFim))
          ? 'Não Consta'
          : new Date(categoryInfo.dtFim).toLocaleDateString('pt-BR')
      }

      contentDiv.innerHTML = `
                <div style="width:10%; height:100px; padding: 15px;border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;color: white;background-color: ${color};">${thrend}</i><br><span style="font-size: 9px; color: gray;">Panvel</span><br><br><span style="font-size: 10px;font-weight: 800;">${concorrente}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;color: white;background-color: red;">trending_down</i><br><span style="font-size: 9px; color: gray;">Produtos</span><br><br><span style="font-size: 10px;font-weight: 800;">${lprice}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;color: white;background-color: green;">ssid_chart</i><br><span style="font-size: 9px; color: gray;">IC</span><br><br><span style="font-size: 10px;font-weight: 800;">${ic}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">attach_money</i><br><span style="font-size: 9px; color: gray;">Vendas hoje</span><br><br><span style="font-size: 10px;font-weight: 800;">${todayS}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">attach_money</i><br><span style="font-size: 9px; color: gray;">Vendas s-1</span><br><br><span style="font-size: 10px;font-weight: 800;">${weekS}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">attach_money</i><br><span style="font-size: 9px; color: gray;">Vendas mês</span><br><br><span style="font-size: 10px;font-weight: 800;">${monthS}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">event_available</i><br><span style="font-size: 9px; color: gray;">Início da Oferta</span><br><br><span style="font-size: 10px;font-weight: 800;">${dtInicio}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">event_busy</i><br><span style="font-size: 9px; color: gray;">Fim da Oferta</span><br><br><span style="font-size: 10px;font-weight: 800;">${dtFim}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">groups_2</i><br><span style="font-size: 9px; color: gray;">Volume de Visitas</span><br><br><span style="font-size: 10px;font-weight: 800;">${'Integrar'}</span></div>
                <div style="width:10%; height:100px; padding: 15px; margin-left:10px; border-radius: 10px;background-color: #FFF;border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;color: rgb(51, 51, 51);align-self: center;display: block;text-align: center; overflow-wrap: break-word;"><i class="material-icons" style="font-size: 25px !important;!i;!;!;font-weight: 800 !important;!i;!;">trending_up</i><br><span style="font-size: 9px; color: gray;">Taxa de conversão</span><br><br><span style="font-size: 10px;font-weight: 800;">${'Integrar'}</span></div>
            `
    })

    headerProduct.appendChild(contentDiv)
    headerProduct.appendChild(document.createElement('br'))
    headerProduct.appendChild(document.createElement('br'))
  } else {
    console.log('Elemento h1 não encontrado.')
  }
}
