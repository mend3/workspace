const masks = [
  [0, 'None'],
  [1, 'D'],
  [2, 'C'],
  [3, 'B'],
  [4, 'A'],
  [5, 'S'],
] as const

export class CrystalType {
  static readonly MASKS = masks.map(([mask, type]) => new CrystalType(mask, type.toLowerCase()))

  crystalItemIds = [0, 1458, 1459, 1460, 1461, 1462] as const
  crystalEnchantBonusArmor = [0, 11, 6, 11, 19, 25] as const
  crystalEnchantBonusWeapon = [0, 90, 45, 67, 144, 250] as const

  protected constructor(
    readonly mask: number,
    readonly value: string,
  ) {}

  static fromId = (type: string | number) => {
    const mask = CrystalType.MASKS[+type]
    if (!mask) throw new Error(`Invalid crystal id: ${type}`)

    return mask
  }
}
