enum L2ArmorType {
  NONE = 1,
  LIGHT = 2,
  HEAVY = 3,
  MAGIC = 4,
  PET = 5,
}
const masks = [
  [L2ArmorType.NONE, 'None'],
  [L2ArmorType.LIGHT, 'Light'],
  [L2ArmorType.HEAVY, 'Heavy'],
  [L2ArmorType.MAGIC, 'Magic'],
  [L2ArmorType.PET, 'Pet'],
] as const

class ArmorType {
  static readonly MASKS = Object.values(masks).map(([mask, alias]) => new ArmorType(mask, alias.toLowerCase()))

  protected constructor(
    readonly id: number,
    readonly value: string,
  ) {}

  get mask(): number {
    return 1 << (this.id + 16)
  }

  toString(): string {
    return this.value
  }

  static fromId = (id: number | string) => {
    const mask = ArmorType.MASKS[+id]
    if (!mask) throw new Error(`Invalid armor id: ${id}`)

    return mask
  }
}

const armorTypesMap = ArmorType.MASKS.reduce((map, cur) => map.set(cur.id, cur), new Map<L2ArmorType, ArmorType>())

export { ArmorType, armorTypesMap, L2ArmorType }
