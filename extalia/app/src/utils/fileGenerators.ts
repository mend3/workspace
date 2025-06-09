import { CalculatedIds, ItemSetData } from '@/lib/itemset'
import { ArmorSetSQLGenerator, ArmorSQLGenerator, WeaponSQLGenerator } from './generators/SQLGenerators'
import {
  ArmorGrpGenerator,
  ItemNameGrpGenerator,
  SkillGrpGenerator,
  SkillNameGenerator,
  WeaponGrpGenerator,
} from './generators/TSVGenerators'

export function generateFiles(data: ItemSetData) {
  const ids = calculateIds(data)

  // Initialize generators
  const itemNameGrpGen = new ItemNameGrpGenerator()
  const armorGrpGen = new ArmorGrpGenerator()
  const weaponGrpGen = new WeaponGrpGenerator()
  const skillGrpGen = new SkillGrpGenerator()
  const skillNameGen = new SkillNameGenerator()
  const armorSQLGen = new ArmorSQLGenerator()
  const weaponSQLGen = new WeaponSQLGenerator()
  const armorSetSQLGen = new ArmorSetSQLGenerator()

  // Generate files
  const files = {
    itemnamegrp: itemNameGrpGen.generate(data, ids).concat('\n'),
    armorgrp: armorGrpGen.generate(data, ids).concat('\n'),
    weapongrp: weaponGrpGen.generate(data, ids).concat('\n'),
    skillname: skillNameGen.generate(data, ids).concat('\n'),
    skillgrp: skillGrpGen.generate(data, ids).concat('\n'),
    armorsql: armorSQLGen.generate(data, ids).concat('\n'),
    weaponsql: weaponSQLGen.generate(data, ids).concat('\n'),
    armorsetsql: armorSetSQLGen.generate(data, ids).concat('\n'),
  }

  return files
}

/**
 * Zips two arrays into an object.
 * @param A - The first array.
 * @param B - The second array.
 * @returns An object with the keys from A and the values from B.
 */
export function zipToObject(A: string[], B: string[]) {
  if (A.length !== B.length) {
    throw new Error('Arrays must have the same length.')
  }

  const result: Record<string, string> = {}
  for (let i = 0; i < A.length; i++) {
    result[A[i]] = B[i]
  }

  return result
}

/**
 * Calculates the ids for the itemset.
 * @param data - The itemset data.
 * @returns The calculated ids.
 */
export function calculateIds(data: Pick<ItemSetData, 'baseId' | 'existingHelmetId' | 'includeShield'>): CalculatedIds {
  const baseId = data.baseId
  const setId = baseId + 1000

  const helmetId = data.existingHelmetId || baseId + 4
  const shieldId = data.includeShield ? baseId + 5 : null

  const ids: CalculatedIds = {
    setId,
    chest: baseId,
    legs: baseId + 1,
    gloves: baseId + 2,
    feet: baseId + 3,
    helmet: helmetId,
    shield: shieldId,
  }

  return ids
}
