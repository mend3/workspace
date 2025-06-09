import { ArmorSetData, GeneratedIDs } from '../types/armor-set'

// Base IDs for different categories
const BASE_IDS = {
  ARMOR: 9208,
  WEAPON: 11330,
  SKILL: 29211,
  ETCITEM: 24669,
}

// Increment counters for each category
let armorSetCounter = 0
let jewelrySetCounter = 0
let weaponCounter = 0
let shieldCounter = 0
let skillCounter = 0
let etcitemCounter = 0

export function generateIDs(data: ArmorSetData): GeneratedIDs {
  const { helmetId, chestId } = data
  const setChestId = chestId || BASE_IDS.ARMOR + armorSetCounter * 100 + 1
  const ids: GeneratedIDs = {
    // Armor Set IDs
    sealedChestId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 1,
    sealedGaitersId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 2,
    sealedGauntletsId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 3,
    sealedBootsId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 4,
    sealedHelmetId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 5,

    // Armor Set Recipe IDs
    sealedChest60Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 11,
    sealedChest100Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 12,
    sealedGaiters60Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 13,
    sealedGaiters100Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 14,
    sealedGauntlets60Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 15,
    sealedGauntlets100Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 16,
    sealedBoots60Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 17,
    sealedBoots100Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 18,
    sealedHelmet60Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 19,
    sealedHelmet100Id: BASE_IDS.ETCITEM + etcitemCounter * 100 + 20,

    // Armor Set Part IDs
    sealedChestPartId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 31,
    sealedGaitersPartId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 32,
    sealedGauntletsDesignId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 33,
    sealedBootsDesignId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 34,
    sealedHelmetPatternId: BASE_IDS.ETCITEM + etcitemCounter * 100 + 35,

    // Skill IDs
    setSkillId: BASE_IDS.SKILL + skillCounter * 10 + 1,

    setChestId,
    setGaitersId: setChestId + 1,
    setGauntletsId: setChestId + 2,
    setBootsId: setChestId + 3,
    setHelmetId: helmetId || null,
  }

  // Generate Jewelry Set IDs if included
  if (data.jewelrySet) {
    ids.sealedEarringPartId = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 1
    ids.sealedRingGem = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 2
    ids.sealedNecklaceChain = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 3
    ids.recipeSealedEarring70 = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 11
    ids.recipeSealedEarring100 = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 12
    ids.recipeSealedRing70 = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 13
    ids.recipeSealedRing100 = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 14
    ids.recipeSealedNecklace70 = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 15
    ids.recipeSealedNecklace100 = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 16
    ids.jEarringId = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 21
    ids.jRingId = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 22
    ids.jNecklaceId = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 23
    ids.jSealedEarringId = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 31
    ids.jSealedRingId = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 32
    ids.jSealedNecklaceId = BASE_IDS.ARMOR + jewelrySetCounter * 100 + 33
    ids.jJewelSkillId = BASE_IDS.SKILL + skillCounter * 10 + 2
    jewelrySetCounter++
  }

  // Generate Weapon IDs if included
  if (data.weapon) {
    ids.weaponId = BASE_IDS.WEAPON + weaponCounter * 100 + 1
    ids.weaponVar1Id = BASE_IDS.WEAPON + weaponCounter * 100 + 2
    ids.weaponVar2Id = BASE_IDS.WEAPON + weaponCounter * 100 + 3
    ids.weaponVar3Id = BASE_IDS.WEAPON + weaponCounter * 100 + 4
    ids.weaponMaterialId = BASE_IDS.WEAPON + weaponCounter * 100 + 11
    ids.weaponRecipe60Id = BASE_IDS.WEAPON + weaponCounter * 100 + 21
    ids.weaponRecipe100Id = BASE_IDS.WEAPON + weaponCounter * 100 + 22
    weaponCounter++
  }

  // Generate Shield IDs if included
  if (data.includeShield) {
    ids.shieldId = BASE_IDS.WEAPON + shieldCounter * 100 + 1
    ids.shieldSealedMaterialId = BASE_IDS.WEAPON + shieldCounter * 100 + 11
    ids.shieldSealedRecipe60Id = BASE_IDS.WEAPON + shieldCounter * 100 + 21
    ids.shieldSealedRecipe100Id = BASE_IDS.WEAPON + shieldCounter * 100 + 22
    ids.shieldSealedId = BASE_IDS.WEAPON + shieldCounter * 100 + 31
    // ids.shieldSkillId = BASE_IDS.SKILL + skillCounter * 10 + 3
    shieldCounter++
  }

  // Increment counters
  armorSetCounter++
  etcitemCounter++
  skillCounter++

  return ids
}
