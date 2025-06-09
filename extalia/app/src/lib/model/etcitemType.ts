enum L2EtcItemType {
  ARROW = 0, //(0, "Arrow"),
  MATERIAL = 1, //(1, "Material"),
  PET_COLLAR = 2, //(2, "PetCollar"),
  POTION = 3, //(3, "Potion"),
  RECEIPE = 4, //(4, "Receipe"),
  SCROLL = 5, //(5, "Scroll"),
  QUEST = 6, //(6, "Quest"),
  MONEY = 7, //(7, "Money"),
  OTHER = 8, //(8, "Other"),
  SPELLBOOK = 9, //(9, "Spellbook"),
  SEED = 10, //(10, "Seed"),
  SHOT = 11, //(11, "Shot"),
  HERB = 12, //(12, "Herb"),
}
const masks = [
  [L2EtcItemType.ARROW, 'Arrow'],
  [L2EtcItemType.MATERIAL, 'Material'],
  [L2EtcItemType.PET_COLLAR, 'PetCollar'],
  [L2EtcItemType.POTION, 'Potion'],
  [L2EtcItemType.RECEIPE, 'Receipe'],
  [L2EtcItemType.SCROLL, 'Scroll'],
  [L2EtcItemType.QUEST, 'Quest'],
  [L2EtcItemType.MONEY, 'Money'],
  [L2EtcItemType.OTHER, 'Other'],
  [L2EtcItemType.SPELLBOOK, 'Spellbook'],
  [L2EtcItemType.SEED, 'Seed'],
  [L2EtcItemType.SHOT, 'Shot'],
  [L2EtcItemType.HERB, 'Herb'],
] as const

class EtcItemType {
  static readonly MASKS = Object.values(masks).map(([mask, alias]) => new EtcItemType(mask, alias.toLowerCase()))

  protected constructor(
    readonly id: number | L2EtcItemType,
    readonly value: string,
  ) {}

  get mask(): number {
    return 1 << (this.id + 21)
  }

  toString(): string {
    return this.value
  }

  static fromId = (_type: string | number) => {
    const typeId = +_type

    const mask = EtcItemType.MASKS.find(type => type.id === typeId)
    if (!mask) throw new Error(`Invalid type type: ${typeId}`)

    return mask
  }
}

const etcItemTypesMap = EtcItemType.MASKS.reduce(
  (map, cur) => map.set(cur.id, cur),
  new Map<L2EtcItemType, EtcItemType>(),
)

export { EtcItemType, etcItemTypesMap, L2EtcItemType }
