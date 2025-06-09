import { ArmorSetData, JewelrySetEffects, WeaponEffects } from '../types/armor-set'
import { GeneratedIDs } from '../types/armor-set'

export function generateArmorSetItems(data: ArmorSetData, ids: GeneratedIDs): string {
  const { setName, effects } = data
  let output = ''

  // Generate Armor Set items
  output += `${ids.setChestId}\t${setName} Breastplate\t\t\t-1\t${ids.setChestId},${ids.setGaitersId},${ids.setHelmetId},${ids.setGauntletsId},${ids.setBootsId}\t${effects.setEffectDescription}\t${ids.shieldId}\t${effects.setBonus}\t0\t0\t6\t${effects.setEnchantBonus}\n`
  // output += `${ids.sealedChestPartId}\tSealed ${setName} Breastplate Part\t\tMain ingredient required for a Dwarf to make the Sealed ${setName} Breastplate. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedChest60Id}\tRecipe: Sealed ${setName} Breastplate (60%)\t\tFor Dwarves only. The recipe for a Sealed ${setName} Breastplate. Requires Create Item - Skill Level 9. The success rate is 60%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedChest100Id}\tRecipe: Sealed ${setName} Breastplate (100%)\t\tFor Dwarves only. The recipe for a Sealed ${setName} Breastplate. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedChestId}\tSealed ${setName} Breastplate\t\tSealed ${setName} Breastplate. Its seal can be broken with the help of the Blacksmith of Mammon.\t-1\t\t\t\t0\t0\t0\n\n`;

  output += `${ids.setGaitersId}\t${setName} Gaiters\t\t\t-1\t\t\t\t\t0\t0\t0\t\n`
  // output += `${ids.sealedGaitersPartId}\tSealed ${setName} Gaiters Pattern\t\tMain ingredient required for a Dwarf to make the Sealed ${setName} Gaiters. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedGaiters60Id}\tRecipe: Sealed ${setName} Gaiters (60%)\t\tFor Dwarves only. The recipe for Sealed ${setName} Gaiters. Requires Create Item - Skill Level 9. The success rate is 60%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedGaiters100Id}\tRecipe: Sealed ${setName} Gaiters (100%)\t\tFor Dwarves only. The recipe for Sealed ${setName} Gaiters. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedGaitersId}\tSealed ${setName} Gaiters\t\tSealed ${setName} Gaiters. Its seal can be broken with the help of the Blacksmith of Mammon.\t-1\t\t\t\t0\t0\t0\n\n`;

  output += `${ids.setGauntletsId}\t${setName} Gauntlets\t\t\t-1\t\t\t\t\t0\t0\t0\t\n`
  // output += `${ids.sealedGauntletsDesignId}\tSealed ${setName} Gauntlets Design\t\tMain ingredient required for a Dwarf to make the sealed ${setName} gauntlet. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedGauntlets60Id}\tRecipe: Sealed ${setName} Gauntlets (60%)\t\tFor Dwarves only. The recipe for Sealed ${setName} Gauntlets. Requires Create Item - Skill Level 9. The success rate is 60%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedGauntlets100Id}\tRecipe: Sealed ${setName} Gauntlets (100%)\t\tFor Dwarves only. The recipe for Sealed ${setName} Gauntlets. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedGauntletsId}\tSealed ${setName} Gauntlet\t\tSealed ${setName} Gauntlets. Its seal can be broken with the help of the Blacksmith of Mammon.\t-1\t\t\t\t0\t0\t0\n\n`;

  output += `${ids.setBootsId}\t${setName} Boots\t\t\t-1\t\t\t\t\t0\t0\t0\t\n`
  // output += `${ids.sealedBootsDesignId}\tSealed ${setName} Boots Design\t\tMain ingredient required for a Dwarf to make the Sealed ${setName} Boots. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedBoots60Id}\tRecipe: Sealed ${setName} Boots (60%)\t\tFor Dwarves only. The recipe for a Sealed ${setName} Boots. Requires Create Item - Skill Level 9. The success rate is 60%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedBoots100Id}\tRecipe: Sealed ${setName} Boots (100%)\t\tFor Dwarves only. The recipe for a Sealed ${setName} Boots. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedBootsId}\tSealed ${setName} Boots\t\tSealed ${setName} Boots. Its seal can be broken with the help of the Blacksmith of Mammon.\t-1\t\t\t\t0\t0\t0\n\n`;

  // output += `${ids.sealedHelmetPatternId}\tSealed ${setName} Helmet Pattern\t\tMain ingredient required for a Dwarf to make the Sealed ${setName} Helmet. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedHelmet60Id}\tRecipe: Sealed ${setName} Helmet (60%)\t\tFor Dwarves only. The recipe for a Sealed ${setName} Helmet. Requires Create Item - Skill Level 9. The success rate is 60%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedHelmet100Id}\tRecipe: Sealed ${setName} Helmet (100%)\t\tFor Dwarves only. The recipe for a Sealed ${setName} Helmet. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.sealedHelmetId}\tSealed ${setName} Helmet\t\tSealed ${setName} Helmet. Its seal can be broken with the help of the Blacksmith of Mammon.\t-1\t\t\t\t0\t0\t0\n\n`;

  return output
}

export function generateJewelrySetItems(data: { name: string; effects: JewelrySetEffects }, ids: GeneratedIDs): string {
  const { name, effects } = data
  let output = ''

  // output += `${ids.sealedEarringPartId}\tSealed ${name} Earring Part\t\tMain ingredient required for a Dwarf to make the Sealed ${name} Earrings. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.recipeSealedEarring70}\tRecipe: Sealed ${name} Earring (70%)\t\tFor Dwarves only. The recipe for sealed ${name} earrings. Requires Create Item - Skill Level 9. The success rate is 70%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.recipeSealedEarring100}\tRecipe: Sealed ${name} Earring (100%)\t\tFor Dwarves only. The recipe for sealed ${name} earrings. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.jSealedEarringId}\tSealed ${name} Earring\t\tThe seal can be broken with the help of the Blacksmith of Mammon. When the seal is broken, the effect of ${effects.earringEffect} is given.\t-1\t\t\t\t0\t0\t0\n\n`;
  output += `${ids.jSealedEarringId}\t${name} Earring\t\t${name} Earring. Produces the effect of MP +31.\t-1\t\t\t\t\t0\t0\t0\t\n`

  // output += `${ids.sealedRingGem}\tSealed ${name} Ring Gem\t\tMain ingredient required for a Dwarf to make the Sealed ${name} Ring. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.recipeSealedRing70}\tRecipe: Sealed ${name} Ring(70%)\t\tFor Dwarves only. The recipe for a Sealed ${name} Ring. Requires Create Item - Skill Level 9. The success rate is 70%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.recipeSealedRing100}\tRecipe: Sealed ${name} Ring(100%)\t\tFor Dwarves only. The recipe for a Sealed ${name} Ring. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.jSealedRingId}\tSealed ${name} Ring\t\tThe seal of this item can be broken by going through the Blacksmith of Mammon. When the seal is broken, it will produce the effects of ${effects.ringEffect}.\t-1\t\t\t\t0\t0\t0\n\n`;
  output += `${ids.jSealedRingId}\t${name} Ring\t\t${name} Ring. Produces the effect of MP +21.\t-1\t\t\t\t\t0\t0\t0\t\n`

  // output += `${ids.sealedNecklaceChain}\tSealed ${name} Necklace Chain\t\tMain ingredient required for a Dwarf to make the Sealed ${name} Necklace. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.recipeSealedNecklace70}\tRecipe: Sealed ${name} Necklace(70%)\t\tFor Dwarves only. The recipe for a Sealed ${name} Necklace. Requires Create Item - Skill Level 9. The success rate is 70%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.recipeSealedNecklace100}\tRecipe: Sealed ${name} Necklace(100%)\t\tFor Dwarves only. The recipe for a Sealed ${name} Necklace. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.jSealedNecklaceId}\tSealed ${name} Necklace\t\tThe seal can be broken with the help of the Blacksmith of Mammon. Once the seal is broken, the effect of ${effects.necklaceEffect} are given.\t-1\t\t\t\t0\t0\t0\n\n`;
  output += `${ids.jSealedNecklaceId}\t${name} Necklace\t\t${name} Necklace. Produces the effect of MP +42.\t-1\t\t\t\t\t0\t0\t0\t\n`

  return output
}

export function generateWeaponItems(data: { name: string; effects: WeaponEffects }, ids: GeneratedIDs): string {
  const { name, effects } = data
  let output = ''

  output += `${ids.weaponId}\t${name}\t\t${effects.description}\t-1\t\t\t\t0\t0\t0\n`
  if (effects.effect1) {
    output += `${ids.weaponVar1Id}\t${name}\t${effects.effect1}\t<Soul Crystal Enhancement> ${effects.effectDescription1}\t-1\t\t\t\t0\t0\t0\n`
  }
  if (effects.effect2) {
    output += `${ids.weaponVar2Id}\t${name}\t${effects.effect2}\t<Soul Crystal Enhancement> ${effects.effectDescription2}\t-1\t\t\t\t0\t0\t0\n`
  }
  if (effects.effect3) {
    output += `${ids.weaponVar3Id}\t${name}\t${effects.effect3}\t<Soul Crystal Enhancement> ${effects.effectDescription3}\t-1\t\t\t\t0\t0\t0\n`
  }
  output += `${ids.weaponMaterialId}\t${name} Edge\t\tMain ingredient required for a Dwarf to make a ${name}. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`
  output += `${ids.weaponRecipe60Id}\tRecipe: ${name} (60%)\t\tFor Dwarves only. The recipe for a ${name}. Requires Create Item - Skill Level 9. The success rate is 60%.\t-1\t\t\t\t0\t0\t0\n`
  output += `${ids.weaponRecipe100Id}\tRecipe: ${name} (100%)\t\tFor Dwarves only. The recipe for a ${name}. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n\n`

  return output
}

export function generateShieldItems(setName: string, ids: GeneratedIDs): string {
  let output = ''

  output += `${ids.shieldId}\t${setName} Shield\t\t\t-1\t\t\t\t0\t0\t0\n`
  // output += `${ids.shieldSealedMaterialId}\tSealed ${setName} Shield Part\t\tMain ingredient required for a Dwarf to make the Sealed ${setName} Shield. Can also be sold at ordinary shops.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.shieldSealedRecipe60Id}\tRecipe: Sealed ${setName} Shield (60%)\t\tFor Dwarves only. The recipe for a Sealed ${setName} Shield. Requires Create Item - Skill Level 9. The success rate is 60%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.shieldSealedRecipe100Id}\tRecipe: Sealed ${setName} Shield (100%)\t\tFor Dwarves only. The recipe for a Sealed ${setName} Shield. Requires Create Item - Skill Level 9. The success rate is 100%.\t-1\t\t\t\t0\t0\t0\n`;
  // output += `${ids.shieldSealedId}\tSealed ${setName} Shield\t\tSealed ${setName} Shield. Its seal can be broken with the help of the Blacksmith of Mammon.\t-1\t\t\t\t0\t0\t0\n\n`;

  return output
}

export function generateSkillGrp(data: ArmorSetData, ids: GeneratedIDs): string {
  let output = ''
  
  output += `${ids.setSkillId}\t1\t2\t0\t-1\t0\t0.00000000\t0\t\t\t${data.icon}\t\t0\t0\t0\t-1\t-1\n`

  return output
}

export function generateSkillNames(data: ArmorSetData, ids: GeneratedIDs): string {
  let output = ''

  output += `${ids.setSkillId}\t1\t${data.setName} Armor Set\t${data.effects.setEffectDescription}\tnone\tnone\n`

  if (data.jewelrySet) {
    output += `${ids.jJewelSkillId}\t1\t${data.jewelrySet.name} Jewelry Set\t${data.jewelrySet.effects.setEffect}\tnone\tnone\n`
  }

  if (data.includeShield) {
    output += `3551\t1\tEquipped with Shield\tAdditional resistance to Poison/Bleed.\tnone\tnone\n`
  }

  return output
}
