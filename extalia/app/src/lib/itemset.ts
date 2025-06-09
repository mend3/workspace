export interface ItemSetData {
  setName: string
  baseId: number // Base ID for the set
  setBonusDesc: string
  shieldBonusDesc: string
  enchantBonusDesc: string
  includeShield: boolean // Whether to include a shield in the set
  includeHelmet: boolean // Whether to create a new helmet or use existing one
  existingHelmetId?: number // ID of existing helmet if not creating new one
}

export type BodyPart =
  | 'rhand'
  | 'lrhand'
  | 'lhand'
  | 'wolf'
  | 'underwear'
  | 'strider'
  | 'rfinger'
  | 'lfinger'
  | 'rear'
  | 'lear'
  | 'neck'
  | 'legs'
  | 'head'
  | 'hatchling'
  | 'hair'
  | 'gloves'
  | 'fullarmor'
  | 'feet'
  | 'face'
  | 'dhair'
  | 'chest'
  | 'babypet'
export type CrystalType = 'none' | 'd' | 'c' | 'b' | 'a' | 's'
export type Material =
  | 'cloth'
  | 'leather'
  | 'wood'
  | 'bone'
  | 'bronze'
  | 'fine_steel'
  | 'cotton'
  | 'mithril'
  | 'silver'
  | 'gold'
  | 'adamantaite'
  | 'steel'
  | 'oriharukon'
  | 'blood_steel'
  | 'crystal'
  | 'damascus'
  | 'chrysolite'
  | 'scale_of_dragon'
  | 'dyestuff'
  | 'cobweb'
  | 'paper'
export type ArmorType = 'none' | 'light' | 'medium' | 'heavy' | 'full'
export type WeaponType =
  | 'sword'
  | 'blunt'
  | 'bigblunt'
  | 'dagger'
  | 'bow'
  | 'pole'
  | 'none'
  | 'bigsword'
  | 'etc'
  | 'fist'
  | 'dualfist'
  | 'dual'
  | 'pet'
  | 'rod'
type SQLBoolean = 'true' | 'false'

// Calculated IDs
export interface CalculatedIds {
  setId: number // Base ID for the set
  chest: number
  legs: number
  gloves: number
  feet: number
  helmet: number
  shield: number | null
}

export interface ArmorSet {
  id: number
  chest: number
  legs: number
  head: number
  gloves: number
  feet: number
  skill_id: number
  shield: number
  shield_skill_id: number
  enchant6skill: number
}

export interface ArmorSQL {
  item_id: number
  name: string
  bodypart: BodyPart
  crystallizable: SQLBoolean
  armor_type: ArmorType
  weight: number
  material: Material
  crystal_type: CrystalType
  avoid_modify: number
  duration: number
  p_def: number
  m_def: number
  mp_bonus: number
  price: number
  crystal_count: number
  sellable: SQLBoolean
  dropable: SQLBoolean
  destroyable: SQLBoolean
  tradeable: SQLBoolean
  item_skill_id: number
  item_skill_lvl: number
}

export interface WeaponSQL {
  item_id: number
  name: string
  bodypart: BodyPart
  crystallizable: SQLBoolean
  weight: number
  soulshots: number
  spiritshots: number
  material: Material
  crystal_type: CrystalType
  p_dam: number
  rnd_dam: number
  weaponType: WeaponType
  critical: number
  hit_modify: number
  avoid_modify: number
  shield_def: number
  shield_def_rate: number
  atk_speed: number
  mp_consume: number
  m_dam: number
  duration: number
  price: number
  crystal_count: number
  sellable: SQLBoolean
  dropable: SQLBoolean
  destroyable: SQLBoolean
  tradeable: SQLBoolean
  item_skill_id: number
  item_skill_lvl: number
  enchant4_skill_id: number
  enchant4_skill_lvl: number
  onCast_skill_id: number
  onCast_skill_lvl: number
  onCast_skill_chance: number
  onCrit_skill_id: number
  onCrit_skill_lvl: number
  onCrit_skill_chance: number
}

export interface GeneratedFiles {
  [key: string]: string
}

export interface FileGenerator {
  generate(data: ItemSetData, ids: CalculatedIds): string
}

export interface SQLGenerator extends FileGenerator {
  generateTableSQL(): string
  generateInsertSQL(data: ItemSetData, ids: CalculatedIds): string
}

export interface TSVGenerator extends FileGenerator {
  generateHeaders(): string
  generateRows(data: ItemSetData, ids: CalculatedIds): string[]
}
