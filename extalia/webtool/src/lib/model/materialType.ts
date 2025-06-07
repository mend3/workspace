const MATERIAL_STEEL = 0x00 // ??
const MATERIAL_FINE_STEEL = 0x01 // ??
const MATERIAL_BLOOD_STEEL = 0x02 // ??
const MATERIAL_BRONZE = 0x03 // ??
const MATERIAL_SILVER = 0x04 // ??
const MATERIAL_GOLD = 0x05 // ??
const MATERIAL_MITHRIL = 0x06 // ??
const MATERIAL_ORIHARUKON = 0x07 // ??
const MATERIAL_PAPER = 0x08 // ??
const MATERIAL_WOOD = 0x09 // ??
const MATERIAL_CLOTH = 0x0a // ??
const MATERIAL_LEATHER = 0x0b // ??
const MATERIAL_BONE = 0x0c // ??
const MATERIAL_HORN = 0x0d // ??
const MATERIAL_DAMASCUS = 0x0e // ??
const MATERIAL_ADAMANTAITE = 0x0f // ??
const MATERIAL_CHRYSOLITE = 0x10 // ??
const MATERIAL_CRYSTAL = 0x11 // ??
const MATERIAL_LIQUID = 0x12 // ??
const MATERIAL_SCALE_OF_DRAGON = 0x13 // ??
const MATERIAL_DYESTUFF = 0x14 // ??
const MATERIAL_COBWEB = 0x15 // ??
const MATERIAL_SEED = 0x15 // ??

const materials = {
  paper: MATERIAL_PAPER,
  wood: MATERIAL_WOOD,
  liquid: MATERIAL_LIQUID,
  cloth: MATERIAL_CLOTH,
  leather: MATERIAL_LEATHER,
  horn: MATERIAL_HORN,
  bone: MATERIAL_BONE,
  bronze: MATERIAL_BRONZE,
  fine_steel: MATERIAL_FINE_STEEL,
  cotton: MATERIAL_FINE_STEEL,
  mithril: MATERIAL_MITHRIL,
  silver: MATERIAL_SILVER,
  gold: MATERIAL_GOLD,
  adamantaite: MATERIAL_ADAMANTAITE,
  steel: MATERIAL_STEEL,
  oriharukon: MATERIAL_ORIHARUKON,
  blood_steel: MATERIAL_BLOOD_STEEL,
  crystal: MATERIAL_CRYSTAL,
  damascus: MATERIAL_DAMASCUS,
  chrysolite: MATERIAL_CHRYSOLITE,
  scale_of_dragon: MATERIAL_SCALE_OF_DRAGON,
  dyestuff: MATERIAL_DYESTUFF,
  cobweb: MATERIAL_COBWEB,
  seed: MATERIAL_SEED,
} as const

export class MaterialType {
  static readonly MASKS = Object.entries(materials).map(([type, value]) => new MaterialType(type, value))
  protected constructor(
    readonly type: string,
    readonly value: number,
  ) {}

  static fromId = (material: string | number) => {
    return MaterialType.MASKS.find(t => t.value === +material) ?? +material
  }
}
