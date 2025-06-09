export interface ArmorSetEffects {
  setBonus: string
  setEnchantBonus: string
  setEffectDescription: string
}

export interface JewelrySetEffects {
  ringEffect: string
  earringEffect: string
  necklaceEffect: string
  setEffect: string
}

export interface WeaponEffects {
  description: string
  effect1?: string
  effectDescription1?: string
  effect2?: string
  effectDescription2?: string
  effect3?: string
  effectDescription3?: string
}

export interface ArmorSetData {
  setName: string
  effects: ArmorSetEffects
  icon?: string
  chestId?: number
  jewelrySet?: {
    name: string
    effects: JewelrySetEffects
  }
  weapon?: {
    name: string
    effects: WeaponEffects
  }
  includeShield: boolean
  helmetId: number | null
}

export interface GeneratedIDs {
  // Armor Set IDs
  setChestId: number
  setGaitersId: number
  setGauntletsId: number
  setBootsId: number
  setHelmetId: number | null // Optional, can be null if not provided

  // Sealed Armor Set IDs
  sealedChestId: number
  sealedGaitersId: number
  sealedGauntletsId: number
  sealedBootsId: number
  sealedHelmetId: number

  // Armor Set Recipe IDs
  sealedChest60Id: number
  sealedChest100Id: number
  sealedGaiters60Id: number
  sealedGaiters100Id: number
  sealedGauntlets60Id: number
  sealedGauntlets100Id: number
  sealedBoots60Id: number
  sealedBoots100Id: number
  sealedHelmet60Id: number
  sealedHelmet100Id: number

  // Armor Set Part IDs
  sealedChestPartId: number
  sealedGaitersPartId: number
  sealedGauntletsDesignId: number
  sealedBootsDesignId: number
  sealedHelmetPatternId: number

  // Jewelry Set IDs (if included)
  sealedEarringPartId?: number
  sealedRingGem?: number
  sealedNecklaceChain?: number
  recipeSealedEarring70?: number
  recipeSealedEarring100?: number
  recipeSealedRing70?: number
  recipeSealedRing100?: number
  recipeSealedNecklace70?: number
  recipeSealedNecklace100?: number
  jEarringId?: number
  jRingId?: number
  jNecklaceId?: number
  jSealedEarringId?: number
  jSealedRingId?: number
  jSealedNecklaceId?: number

  // Weapon IDs (if included)
  weaponId?: number
  weaponVar1Id?: number
  weaponVar2Id?: number
  weaponVar3Id?: number
  weaponMaterialId?: number
  weaponRecipe60Id?: number
  weaponRecipe100Id?: number

  // Shield IDs (if included)
  shieldId?: number
  shieldSealedMaterialId?: number
  shieldSealedRecipe60Id?: number
  shieldSealedRecipe100Id?: number
  shieldSealedId?: number

  // Skill IDs
  setSkillId: number
  jJewelSkillId?: number
}
