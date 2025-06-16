type LDVariant = any
const removeSchema = <T extends string | null>(value?: T) => {
  if (!value) {
    return null
  }

  return value.replace(/http(s?):\/\/schema.org\//, '')
}

const handleImages = (image: LDVariant['image']): Array<{ url: string; caption?: string }> => {
  if (!image) return []
  const _images = Array.isArray(image) ? image : [image]
  return _images
    .filter(Boolean)
    .map(img => {
      if (typeof img === 'string') return { url: img }

      const { caption, url } = img
      if (!url) return null

      return {
        url,
        caption,
      }
    })
    .filter(img => !!img?.url)
}

const handleReviews = (review: LDVariant['review']) => {
  if (!review || !Array.isArray(review)) return []

  return [...review].map(r => {
    const { reviewRating } = r
    let body: string | null = null
    let date: Date | null = null
    const author = (typeof r.author === 'string' ? r.author : (r.author?.name ?? null)).trim()

    const { bestRating, ratingValue, worstRating } = reviewRating

    if ('datePublished' in r) {
      const { datePublished, reviewBody } = r
      body = reviewBody?.trim() ?? null
      date = datePublished ? new Date(datePublished) : null
    }

    return {
      author,
      worstRating:
        worstRating !== null && typeof worstRating !== undefined ? +parseFloat(String(worstRating)).toFixed(2) : null,
      bestRating:
        bestRating !== null && typeof bestRating !== undefined ? +parseFloat(String(bestRating)).toFixed(2) : null,
      ratingValue:
        ratingValue !== null && typeof ratingValue !== undefined ? +parseFloat(String(ratingValue)).toFixed(2) : null,
      body,
      date,
      name: 'name' in r ? r.name : 'title' in r ? r.title : null,
    }
  })
}

const parseInnerOffers = (innerOffers: Exclude<LDVariant['offers'], undefined>['offers']) => {
  if (!innerOffers) return []

  const _asArray = Array.isArray(innerOffers) ? innerOffers : [innerOffers]

  return _asArray.map(innerOffer => {
    const { sku, seller, priceCurrency, price, itemCondition, availability, url } = innerOffer

    let returnPolicy: {
      applicableCountry: string
      merchantReturnDays: number
      returnPolicyCategory: string | null
      returnMethod: string | null
      returnFees: string | null
    } | null = null
    if (
      'hasMerchantReturnPolicy' in innerOffer &&
      innerOffer.hasMerchantReturnPolicy &&
      innerOffer.hasMerchantReturnPolicy !== null
    ) {
      const hasMerchantReturnPolicy =
        (innerOffer.hasMerchantReturnPolicy as {
          applicableCountry: string
          merchantReturnDays: number
          returnPolicyCategory: string
          returnMethod: string
          returnFees: string
        }) ?? null
      if (hasMerchantReturnPolicy)
        returnPolicy = {
          applicableCountry: hasMerchantReturnPolicy.applicableCountry, //'BR',
          merchantReturnDays: hasMerchantReturnPolicy.merchantReturnDays, //30,
          returnPolicyCategory: removeSchema(hasMerchantReturnPolicy.returnPolicyCategory), //'https://schema.org/MerchantReturnFiniteReturnWindow',
          returnMethod: removeSchema(hasMerchantReturnPolicy.returnMethod), //'https://schema.org/ReturnByMail',
          returnFees: removeSchema(hasMerchantReturnPolicy.returnFees), //'https://schema.org/FreeReturn',
        }
    }

    return {
      url: url ?? null,
      sku,
      price: price !== null && price !== undefined ? +parseFloat(String(price)).toFixed(2) : null,
      priceCurrency: priceCurrency ?? null,
      itemCondition: itemCondition ? removeSchema(itemCondition) : null,
      availability: availability ? removeSchema(availability) : null,
      seller: seller?.name ?? null,
      returnPolicy,
    }
  })
}

const handleOffers = (mainUrl: string | null, _offers: LDVariant['offers']) => {
  if (!_offers) return null

  const offer = _offers as Exclude<LDVariant['offers'], undefined>

  const { url, priceValidUntil, priceCurrency, price, offerCount, lowPrice, itemCondition, highPrice, availability } =
    offer

  let returnPolicy: {
    applicableCountry: string
    merchantReturnDays: number
    returnPolicyCategory: string | null
    returnMethod: string | null
    returnFees: string | null
  } | null = null
  if ('hasMerchantReturnPolicy' in offer && offer.hasMerchantReturnPolicy && offer.hasMerchantReturnPolicy !== null) {
    const hasMerchantReturnPolicy =
      (offer.hasMerchantReturnPolicy as {
        applicableCountry: string
        merchantReturnDays: number
        returnPolicyCategory: string
        returnMethod: string
        returnFees: string
      }) ?? null
    if (hasMerchantReturnPolicy)
      returnPolicy = {
        applicableCountry: hasMerchantReturnPolicy.applicableCountry, //'BR',
        merchantReturnDays: hasMerchantReturnPolicy.merchantReturnDays, //30,
        returnPolicyCategory: removeSchema(hasMerchantReturnPolicy.returnPolicyCategory), //'https://schema.org/MerchantReturnFiniteReturnWindow',
        returnMethod: removeSchema(hasMerchantReturnPolicy.returnMethod), //'https://schema.org/ReturnByMail',
        returnFees: removeSchema(hasMerchantReturnPolicy.returnFees), //'https://schema.org/FreeReturn',
      }
  }

  const parent = {
    url: url ?? null,
    priceValidUntil: priceValidUntil ? new Date(priceValidUntil) : null,
    price: price !== null && price !== undefined ? +parseFloat(String(price)).toFixed(2) : null,
    priceCurrency: priceCurrency ?? null,
    offerCount: offerCount !== null && offerCount !== undefined ? +offerCount : null,
    itemCondition: removeSchema(itemCondition),
    availability: removeSchema(availability),
    highPrice: highPrice !== null && highPrice !== undefined ? +parseFloat(String(highPrice)).toFixed(2) : null,
    lowPrice: lowPrice !== null && lowPrice !== undefined ? +parseFloat(String(lowPrice)).toFixed(2) : null,
    returnPolicy,
  }

  const innerOffers = parseInnerOffers(offer.offers)

  const offers: {
    price: number | null
    priceCurrency: string | null
    itemCondition: string | null
    availability: string | null
    url: string | null
    sku?: string | null
    seller?: string | null
  }[] = [parent, ...innerOffers].map(item => {
    return { ...item, url: item.url ?? mainUrl ?? null }
  })

  return offers
}

const handleItemListElement = (itemListElement: LDVariant['itemListElement']): any => {
  if (!itemListElement) return []

  const asArray = (Array.isArray(itemListElement) ? itemListElement : [itemListElement]).flat()

  return asArray.map(item => {
    switch (item['@type']) {
      case 'Product':
        return render(item as unknown as LDVariant)

      default:
        const proxyItem = { ...item } as Partial<typeof item>
        delete proxyItem['@type']

        return proxyItem
    }
  })
}

const handleVariants = (hasVariant: LDVariant['hasVariant']): any => {
  if (!hasVariant || !Array.isArray(hasVariant)) return []

  return hasVariant.map(variant => render(variant as LDVariant))
}

const handleAggregateRating = (aggregateRating: LDVariant['aggregateRating']) => {
  if (!aggregateRating) return null

  switch (aggregateRating['@type']) {
    case 'AggregateRating': {
      const {
        worstRating,
        url,
        reviewCount,
        ratingCount,
        bestRating,
        additionalProperty: _additionalProperty,
        ratingValue,
      } = aggregateRating
      const type = aggregateRating['@type']

      const additionalProperty = _additionalProperty
        ? {
            description: _additionalProperty.description,
            url: _additionalProperty.url,
          }
        : null

      return {
        type,
        url: url ?? null,
        worstRating:
          worstRating !== null && typeof worstRating !== undefined ? +parseFloat(String(worstRating)).toFixed(2) : null,
        reviewCount:
          reviewCount !== null && typeof reviewCount !== undefined ? +parseFloat(String(reviewCount)).toFixed(2) : null,
        ratingCount:
          ratingCount !== null && typeof ratingCount !== undefined ? +parseFloat(String(ratingCount)).toFixed(2) : null,
        bestRating:
          bestRating !== null && typeof bestRating !== undefined ? +parseFloat(String(bestRating)).toFixed(2) : null,
        ratingValue:
          ratingValue !== null && typeof ratingValue !== undefined ? +parseFloat(String(ratingValue)).toFixed(2) : null,
        additionalProperty,
      }
    }

    default:
      return null
  }
}

/**
 * Normalizes an LDVariant (JSON‑LD object) into a uniform product shape.
 * Handles both Product objects and variants that might be Offers.
 */
const render = (ld: LDVariant) => {
  const type = ld['@type']
  const {
    url,
    name,
    brand,
    mainEntityOfPage,
    image,
    itemCondition,
    aggregateRating: _aggregateRating,
    offers: _offers,
    review,
    hasVariant,
    itemListElement: _itemListElement,
    ...metadata
  } = ld

  let metainfo = metadata as Partial<typeof metadata>

  delete metainfo['@context']
  delete metainfo['@type']

  const images = handleImages(image)
  const aggregateRating = handleAggregateRating(_aggregateRating)
  const offers = handleOffers(url ?? null, _offers)
  const reviews = handleReviews(review)
  const variants = handleVariants(hasVariant)
  const itemListElement = handleItemListElement(_itemListElement)

  return {
    type,
    name,
    url: url ?? null,
    brand: typeof brand === 'object' && brand !== null ? brand.name : (brand ?? null),
    itemCondition: removeSchema(itemCondition),
    entityOf: mainEntityOfPage?.['@id'] ?? null,
    aggregateRating,
    metainfo,
    offers,
    variants,
    images,
    reviews,
    itemListElement,
  }
}
