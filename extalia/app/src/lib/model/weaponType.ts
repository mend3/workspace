enum L2WeaponType {
  NONE = 1, // Shields!!!
  SWORD = 2,
  BLUNT = 3,
  DAGGER = 4,
  BOW = 5,
  POLE = 6,
  ETC = 7,
  FIST = 8,
  DUAL = 9,
  DUALFIST = 10,
  BIGSWORD = 11, // Two Handed Swords
  PET = 12,
  ROD = 13,
  BIGBLUNT = 14,
  FLAG = 15,
}
const masks = [
  [L2WeaponType.NONE, 'Shield'],
  [L2WeaponType.SWORD, 'Sword'],
  [L2WeaponType.BLUNT, 'Blunt'],
  [L2WeaponType.DAGGER, 'Dagger'],
  [L2WeaponType.BOW, 'Bow'],
  [L2WeaponType.POLE, 'Pole'],
  [L2WeaponType.ETC, 'Etc'],
  [L2WeaponType.FIST, 'Fist'],
  [L2WeaponType.DUAL, 'Dual Sword'],
  [L2WeaponType.DUALFIST, 'Dual Fist'],
  [L2WeaponType.BIGSWORD, 'Big Sword'],
  [L2WeaponType.PET, 'Pet'],
  [L2WeaponType.ROD, 'Rod'],
  [L2WeaponType.BIGBLUNT, 'Big Blunt'],
  [L2WeaponType.FLAG, 'FLAG'],
] as const

class WeaponType {
  static readonly MASKS = Object.values(masks).map(([mask, alias], index) => new WeaponType(index, alias))

  constructor(
    readonly id: number,
    readonly value: string,
  ) {}

  get mask(): number {
    return 1 << this.id
  }

  toString(): string {
    return this.value
  }

  static fromType = (key: L2WeaponType | number) => {
    const mask = WeaponType.MASKS.find(type => type.id === key)
    if (!mask) throw new Error(`Invalid armor type: ${key}`)

    return mask
  }

  static fromId = (_id: number | string) => {
    try {
      if (Number.isNaN(+_id)) throw new Error(`Invalid armor id: ${_id}`)

      const mask = WeaponType.MASKS.find(type => type.id === +_id)
      if (!mask) throw new Error(`Invalid armor id: ${_id}`)

      return mask
    } catch (error) {
      return WeaponType.fromType(+_id)
    }
  }
}

const weaponTypesMap = WeaponType.MASKS.reduce((map, cur) => map.set(cur.id, cur), new Map<L2WeaponType, WeaponType>())

export { L2WeaponType, WeaponType, weaponTypesMap }
