import { ItemSetData, CalculatedIds, SQLGenerator, WeaponSQL, ArmorSet, ArmorSQL } from '@/lib/itemset'
import { BaseGenerator } from './BaseGenerator'
import { BASE_STATS, CRYSTAL_TYPE } from '../constants'

export class ArmorSQLGenerator extends BaseGenerator implements SQLGenerator {
  constructor() {
    super([])
  }

  generate(data: ItemSetData, ids: CalculatedIds): string {
    return this.generateInsertSQL(data, ids)
  }

  generateTableSQL(): string {
    return `CREATE TABLE \`armor\` (
  \`item_id\` int unsigned NOT NULL DEFAULT '0',
  \`name\` varchar(70) DEFAULT NULL,
  \`bodypart\` varchar(15) NOT NULL DEFAULT '',
  \`crystallizable\` varchar(5) NOT NULL DEFAULT '',
  \`armor_type\` varchar(5) NOT NULL DEFAULT '',
  \`weight\` int unsigned NOT NULL DEFAULT '0',
  \`material\` varchar(15) NOT NULL DEFAULT '',
  \`crystal_type\` varchar(4) NOT NULL DEFAULT '',
  \`avoid_modify\` int NOT NULL DEFAULT '0',
  \`duration\` int NOT NULL DEFAULT '-1',
  \`p_def\` int unsigned NOT NULL DEFAULT '0',
  \`m_def\` int unsigned NOT NULL DEFAULT '0',
  \`mp_bonus\` int unsigned NOT NULL DEFAULT '0',
  \`price\` int unsigned NOT NULL DEFAULT '0',
  \`crystal_count\` int unsigned DEFAULT '0',
  \`sellable\` varchar(5) DEFAULT NULL,
  \`dropable\` varchar(5) NOT NULL DEFAULT 'true',
  \`destroyable\` varchar(5) NOT NULL DEFAULT 'true',
  \`tradeable\` varchar(5) NOT NULL DEFAULT 'true',
  \`item_skill_id\` decimal(11,0) unsigned NOT NULL DEFAULT '0',
  \`item_skill_lvl\` decimal(11,0) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (\`item_id\`)
);`
  }

  generateInsertSQL(data: ItemSetData, ids: CalculatedIds): string {
    const pieces: ArmorSQL[] = [
      {
        item_id: ids.chest,
        name: `${data.setName} Breastplate`,
        bodypart: 'chest',
        crystallizable: 'true',
        armor_type: 'heavy',
        weight: Number(BASE_STATS.chest.weight),
        material: BASE_STATS.chest.material,
        crystal_type: BASE_STATS.chest.crystal_type,
        avoid_modify: 0,
        duration: -1,
        p_def: +BASE_STATS.chest.pdef,
        m_def: +BASE_STATS.chest.mdef,
        mp_bonus: 0,
        price: Math.floor(+BASE_STATS.chest.weight * 1000),
        crystal_count: Math.floor(+BASE_STATS.chest.weight * 50),
        sellable: 'true',
        dropable: 'true',
        destroyable: 'true',
        tradeable: 'true',
        item_skill_id: 0,
        item_skill_lvl: 0,
      },
      {
        item_id: ids.legs,
        name: `${data.setName} Gaiters`,
        bodypart: 'legs',
        crystallizable: 'true',
        armor_type: 'heavy',
        weight: +BASE_STATS.legs.weight,
        material: BASE_STATS.legs.material,
        crystal_type: BASE_STATS.legs.crystal_type,
        avoid_modify: 0,
        duration: -1,
        p_def: +BASE_STATS.legs.pdef,
        m_def: +BASE_STATS.legs.mdef,
        mp_bonus: 0,
        price: Math.floor(+BASE_STATS.legs.weight * 1000),
        crystal_count: Math.floor(+BASE_STATS.legs.weight * 50),
        sellable: 'true',
        dropable: 'true',
        destroyable: 'true',
        tradeable: 'true',
        item_skill_id: 0,
        item_skill_lvl: 0,
      },
      {
        item_id: ids.gloves,
        name: `${data.setName} Gauntlets`,
        bodypart: 'gloves',
        crystallizable: 'true',
        armor_type: 'none',
        weight: +BASE_STATS.gloves.weight,
        material: BASE_STATS.gloves.material,
        crystal_type: BASE_STATS.gloves.crystal_type,
        avoid_modify: 0,
        duration: -1,
        p_def: +BASE_STATS.gloves.pdef,
        m_def: +BASE_STATS.gloves.mdef,
        mp_bonus: 0,
        price: Math.floor(+BASE_STATS.gloves.weight * 1000),
        crystal_count: Math.floor(+BASE_STATS.gloves.weight * 50),
        sellable: 'true',
        dropable: 'true',
        destroyable: 'true',
        tradeable: 'true',
        item_skill_id: 0,
        item_skill_lvl: 0,
      },
      {
        item_id: ids.feet,
        name: `${data.setName} Boots`,
        bodypart: 'feet',
        crystallizable: 'true',
        armor_type: 'none',
        weight: +BASE_STATS.feet.weight,
        material: BASE_STATS.feet.material,
        crystal_type: BASE_STATS.feet.crystal_type,
        avoid_modify: 0,
        duration: -1,
        p_def: +BASE_STATS.feet.pdef,
        m_def: +BASE_STATS.feet.mdef,
        mp_bonus: 0,
        price: Math.floor(+BASE_STATS.feet.weight * 1000),
        crystal_count: Math.floor(+BASE_STATS.feet.weight * 50),
        sellable: 'true',
        dropable: 'true',
        destroyable: 'true',
        tradeable: 'true',
        item_skill_id: 0,
        item_skill_lvl: 0,
      },
    ]

    if (!data.existingHelmetId)
      pieces.push({
        item_id: ids.helmet,
        name: `${data.setName} Helmet`,
        bodypart: 'head',
        crystallizable: 'true',
        armor_type: 'none',
        weight: +BASE_STATS.head.weight,
        material: BASE_STATS.head.material,
        crystal_type: BASE_STATS.head.crystal_type,
        avoid_modify: +BASE_STATS.head.avoid_mod,
        duration: -1,
        p_def: +BASE_STATS.head.pdef,
        m_def: +BASE_STATS.head.mdef,
        mp_bonus: 0,
        price: Math.floor(+BASE_STATS.head.weight * 1000),
        crystal_count: Math.floor(+BASE_STATS.head.weight * 50),
        sellable: 'true',
        dropable: 'true',
        destroyable: 'true',
        tradeable: 'true',
        item_skill_id: 0,
        item_skill_lvl: 0,
      })

    return pieces
      .map(
        piece =>
          `INSERT INTO \`armor\` VALUES (${Object.entries(piece)
            .map(([key, value]) => `${typeof value === 'number' ? value : `'${value}'`}`)
            .join(',')});`,
      )
      .join('\n')
  }
}

export class WeaponSQLGenerator extends BaseGenerator implements SQLGenerator {
  constructor() {
    super([])
  }

  generate(data: ItemSetData, ids: CalculatedIds): string {
    if (!ids.shield) return ''
    return this.generateInsertSQL(data, ids)
  }

  generateTableSQL(): string {
    return `CREATE TABLE \`weapon\` (
  \`item_id\` int unsigned NOT NULL DEFAULT '0',
  \`name\` varchar(70) DEFAULT NULL,
  \`bodypart\` varchar(15) DEFAULT NULL,
  \`crystallizable\` varchar(5) DEFAULT NULL,
  \`weight\` int unsigned DEFAULT '0',
  \`soulshots\` int unsigned DEFAULT '0',
  \`spiritshots\` int unsigned DEFAULT '0',
  \`material\` varchar(11) DEFAULT NULL,
  \`crystal_type\` varchar(4) DEFAULT NULL,
  \`p_dam\` int unsigned DEFAULT '0',
  \`rnd_dam\` int unsigned DEFAULT '0',
  \`weaponType\` varchar(8) DEFAULT NULL,
  \`critical\` int unsigned DEFAULT '0',
  \`hit_modify\` int DEFAULT '0',
  \`avoid_modify\` int DEFAULT '0',
  \`shield_def\` int unsigned DEFAULT '0',
  \`shield_def_rate\` int unsigned DEFAULT '0',
  \`atk_speed\` int unsigned DEFAULT '0',
  \`mp_consume\` int unsigned DEFAULT '0',
  \`m_dam\` int unsigned DEFAULT '0',
  \`duration\` int DEFAULT '-1',
  \`price\` int unsigned DEFAULT '0',
  \`crystal_count\` int unsigned DEFAULT '0',
  \`sellable\` varchar(5) NOT NULL DEFAULT 'true',
  \`dropable\` varchar(5) NOT NULL DEFAULT 'true',
  \`destroyable\` varchar(5) NOT NULL DEFAULT 'true',
  \`tradeable\` varchar(5) NOT NULL DEFAULT 'true',
  \`item_skill_id\` int unsigned NOT NULL DEFAULT '0',
  \`item_skill_lvl\` int NOT NULL DEFAULT '0',
  \`enchant4_skill_id\` int unsigned NOT NULL DEFAULT '0',
  \`enchant4_skill_lvl\` int unsigned NOT NULL DEFAULT '0',
  \`onCast_skill_id\` int unsigned NOT NULL DEFAULT '0',
  \`onCast_skill_lvl\` int unsigned NOT NULL DEFAULT '0',
  \`onCast_skill_chance\` int unsigned NOT NULL DEFAULT '0',
  \`onCrit_skill_id\` int unsigned NOT NULL DEFAULT '0',
  \`onCrit_skill_lvl\` int unsigned NOT NULL DEFAULT '0',
  \`onCrit_skill_chance\` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (\`item_id\`)
);`
  }

  generateInsertSQL(data: ItemSetData, ids: CalculatedIds): string {
    if (!ids.shield) return ''

    const weapon: WeaponSQL = {
      item_id: ids.shield,
      name: `${data.setName} Shield`,
      bodypart: 'lhand',
      crystallizable: 'true',
      weight: +BASE_STATS.lhand.weight,
      soulshots: 0,
      spiritshots: 0,
      material: BASE_STATS.lhand.material,
      crystal_type: BASE_STATS.lhand.crystal_type,
      p_dam: 0,
      rnd_dam: 0,
      weaponType: 'none',
      critical: 0,
      hit_modify: 0,
      avoid_modify: -8,
      shield_def: +BASE_STATS.lhand.pdef,
      shield_def_rate: +BASE_STATS.lhand.shield_rate,
      price: Math.floor(+BASE_STATS.lhand.weight * 1000),
      crystal_count: Math.floor(+BASE_STATS.lhand.weight * 50),
      atk_speed: 0,
      mp_consume: 0,
      m_dam: 0,
      duration: -1,
      sellable: 'true',
      dropable: 'true',
      destroyable: 'true',
      tradeable: 'true',
      item_skill_id: 0,
      item_skill_lvl: 0,
      enchant4_skill_id: 0,
      enchant4_skill_lvl: 0,
      onCast_skill_id: 0,
      onCast_skill_lvl: 0,
      onCast_skill_chance: 0,
      onCrit_skill_id: 0,
      onCrit_skill_lvl: 0,
      onCrit_skill_chance: 0,
    }

    return `INSERT INTO \`weapon\` VALUES (${Object.entries(weapon)
      .map(([key, value]) => `${typeof value === 'number' ? value : `'${value}'`}`)
      .join(',')});`
  }
}

export class ArmorSetSQLGenerator extends BaseGenerator implements SQLGenerator {
  constructor() {
    super([])
  }

  generate(data: ItemSetData, ids: CalculatedIds): string {
    return this.generateInsertSQL(data, ids)
  }

  generateTableSQL(): string {
    return `CREATE TABLE \`armorsets\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`chest\` int unsigned NOT NULL DEFAULT '0',
  \`legs\` int unsigned NOT NULL DEFAULT '0',
  \`head\` int unsigned NOT NULL DEFAULT '0',
  \`gloves\` int unsigned NOT NULL DEFAULT '0',
  \`feet\` int unsigned NOT NULL DEFAULT '0',
  \`skill_id\` int unsigned NOT NULL DEFAULT '0',
  \`shield\` int unsigned NOT NULL DEFAULT '0',
  \`shield_skill_id\` int unsigned NOT NULL DEFAULT '0',
  \`enchant6skill\` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (\`id\`),
  KEY \`armorset\` (\`chest\`),
  CONSTRAINT \`aChestId\` FOREIGN KEY (\`chest\`) REFERENCES \`armor\` (\`item_id\`) ON DELETE CASCADE ON UPDATE CASCADE
);`
  }

  generateInsertSQL(data: ItemSetData, ids: CalculatedIds): string {
    const skillId = ids.setId + 1000
    const shieldSkillId = ids.setId + 1001
    const enchantSkillId = ids.setId + 1002

    const armorSet: ArmorSet = {
      id: ids.setId,
      chest: ids.chest,
      legs: ids.legs,
      head: ids.helmet,
      gloves: ids.gloves,
      feet: ids.feet,
      skill_id: skillId,
      shield: ids.shield || 0,
      shield_skill_id: ids.shield ? shieldSkillId : 0,
      enchant6skill: enchantSkillId,
    }

    return `INSERT INTO \`armorsets\` VALUES (${Object.entries(armorSet)
      .map(([key, value]) => `${typeof value === 'number' ? value : `'${value}'`}`)
      .join(',')});`
  }
}
