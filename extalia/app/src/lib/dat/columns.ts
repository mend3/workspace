import { ArmorType } from '../model/armorType'
import { BodyPart } from '../model/bodyPart'
import { CrystalType } from '../model/crystalType'
import { EtcItemType } from '../model/etcitemType'
import { MaterialType } from '../model/materialType'
import { WeaponType } from '../model/weaponType'

export class Id {
  constructor(readonly value: string | number) {}

  static fromId = (value: string | number) => new Id(+value)
}

export class Weight {
  constructor(readonly value: string | number) {}

  static fromId = (value: string | number) => new Weight(+value)
}

export class Crystallizable {
  constructor(public value: boolean) {}

  static fromId = (_id: string) => new Crystallizable(_id === '1' || _id === 'true')
}

export class Duration {
  constructor(public value: number) {}

  static fromId = (value: string) => new Duration(+value <= 0 ? -1 : +value)
}

export const columnTypes = {
  Id,
  ItemId: Id,
  SkillId: Id,
  ArmorType,
  CrystalType,
  ItemType: EtcItemType,
  Type1: EtcItemType,
  Material: MaterialType,
  MaterialType,
  WeaponType,
  BodyPart,
  Weight,
  Crystallizable,
  Duration,
}
