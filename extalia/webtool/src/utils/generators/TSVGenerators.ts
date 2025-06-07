import { CalculatedIds, ItemSetData, TSVGenerator } from '@/lib/itemset'
import { ArmorGRP, ItemName, SkillGRP, SkillName, WeaponGRP } from '../../lib/system'
import { BASE_STATS } from '../constants'
import { BaseGenerator } from './BaseGenerator'
import { system_headers } from '@/lib/dat/schemas'

export class ItemNameGrpGenerator extends BaseGenerator implements TSVGenerator {
  constructor() {
    super(system_headers.itemname.split('\t'))
  }

  generate(data: ItemSetData, ids: CalculatedIds): string {
    const rows = this.generateRows(data, ids)
    return `${this.getHeaders()}\n${rows.join('\n')}`
  }

  generateRows(data: ItemSetData, ids: CalculatedIds): string[] {
    const setIds = [ids.chest, ids.legs, ids.helmet, ids.gloves, ids.feet]

    const items: Array<Partial<typeof ItemName>> = [
      {
        id: String(ids.chest),
        name: `${data.setName} Breastplate`,
        add_name: '',
        description: '',
        popup: '-1',
        set_ids: setIds.join(','),
        set_bonus_desc: data.setBonusDesc.trim(),
        set_extra_id: ids.shield?.toString() || '',
        set_extra_desc: data.shieldBonusDesc.trim() || '',
        'unk[0]': '0',
        'unk[1]': '0',
        special_enchant_amount: '6',
        special_enchant_desc: data.enchantBonusDesc.trim(),
      },
      {
        id: String(ids.legs),
        name: `${data.setName} Gaiters`,
        add_name: '',
        description: '',
        popup: '-1',
        set_ids: '',
        set_bonus_desc: '',
        set_extra_id: '',
        set_extra_desc: '',
        'unk[0]': '0',
        'unk[1]': '0',
        special_enchant_amount: '0',
        special_enchant_desc: '',
      },
      {
        id: String(ids.gloves),
        name: `${data.setName} Gauntlets`,
        add_name: '',
        description: '',
        popup: '-1',
        set_ids: '',
        set_bonus_desc: '',
        set_extra_id: '',
        set_extra_desc: '',
        'unk[0]': '0',
        'unk[1]': '0',
        special_enchant_amount: '0',
        special_enchant_desc: '',
      },
      {
        id: String(ids.feet),
        name: `${data.setName} Boots`,
        add_name: '',
        description: '',
        popup: '-1',
        set_ids: '',
        set_bonus_desc: '',
        set_extra_id: '',
        set_extra_desc: '',
        'unk[0]': '0',
        'unk[1]': '0',
        special_enchant_amount: '0',
        special_enchant_desc: '',
      },
    ]

    if (!data.existingHelmetId) {
      items.push({
        id: String(ids.helmet),
        name: `${data.setName} Helmet`,
        add_name: '',
        description: '',
        popup: '-1',
        set_ids: '',
        set_bonus_desc: '',
        set_extra_id: '',
        set_extra_desc: '',
        'unk[0]': '0',
        'unk[1]': '0',
        special_enchant_amount: '0',
        special_enchant_desc: '',
      })
    }

    if (ids.shield) {
      items.push({
        id: String(ids.shield),
        name: `${data.setName} Shield`,
        add_name: '',
        description: '',
        popup: '-1',
        set_ids: '',
        set_bonus_desc: '',
        set_extra_id: '',
        set_extra_desc: '',
        'unk[0]': '0',
        'unk[1]': '0',
        special_enchant_amount: '0',
        special_enchant_desc: '',
      })
    }

    return items.map(item => Object.values(item).join('\t'))
  }
}

export class ArmorGrpGenerator extends BaseGenerator implements TSVGenerator {
  constructor() {
    super(system_headers.armorgrp.split('\t'))
  }

  generate(data: ItemSetData, ids: CalculatedIds): string {
    const rows = this.generateRows(data, ids)
    return `${this.getHeaders()}\n${rows.join('\n')}`
  }

  generateRows(data: ItemSetData, ids: CalculatedIds): string[] {
    const items: Array<Partial<typeof ArmorGRP>> = []

    // Add chest piece
    items.push({
      id: String(ids.chest),
      ...BASE_STATS.chest,
    })

    // Add legs piece
    items.push({
      id: String(ids.legs),
      ...BASE_STATS.legs,
    })

    // Add helmet piece if included
    if (!data.existingHelmetId)
      items.push({
        id: String(ids.helmet),
        ...BASE_STATS.head,
      })

    // Add gloves piece
    items.push({
      id: String(ids.gloves),
      ...BASE_STATS.gloves,
    })

    // Add feet piece
    items.push({
      id: String(ids.feet),
      ...BASE_STATS.feet,
    })

    const fullyQualifiedItems = items.map(
      item => {
        const dummyObject = Object.keys(ArmorGRP).reduce(
          (acc, key, i) => {
            acc[key as keyof typeof acc] = item[key as keyof typeof item] || ''
            return acc
          },
          {} as Record<keyof typeof ArmorGRP, string>,
        )

        return dummyObject
      },
      [] as Array<typeof ArmorGRP>,
    )

    return fullyQualifiedItems.map(item =>
      Object.keys(item)
        .map(key => item[key as keyof typeof item])
        .join('\t'),
    )
  }
}

export class WeaponGrpGenerator extends BaseGenerator implements TSVGenerator {
  constructor() {
    super(system_headers.weapongrp.split('\t'))
  }

  generate(data: ItemSetData, ids: CalculatedIds): string {
    const rows = this.generateRows(data, ids)
    return `${this.getHeaders()}\n${rows.join('\n')}`
  }

  generateRows(data: ItemSetData, ids: CalculatedIds): string[] {
    const items: Array<Partial<typeof WeaponGRP>> = []

    if (ids.shield) {
      items.push({
        tag: '0',
        id: String(ids.shield),
        drop_type: '0',
        drop_anim_type: '2',
        drop_radius: '2',
        drop_height: '5',
        UNK_0: '0',
        durability: '-1',
        weight: String(BASE_STATS.lhand.weight),
        material: BASE_STATS.lhand.material,
        crystallizable: '1',
        'projectile_?': '0',
        body_part: BASE_STATS.lhand.body_part,
        handness: '0',
        item_sound_cnt: '4',
        'item_sound[0]': 'ItemSound.shield_steel_2',
        'item_sound[1]': 'ItemSound.public_armor_02',
        'item_sound[2]': 'MonSound.Hit_Metal_clang_10',
        'item_sound[3]': 'ItemSound.shield_steel_8',
        drop_sound: 'ItemSound.itemdrop_shield_metal',
        equip_sound: 'ItemSound.itemequip_shield_metal',
        effect: '',
        random_damage: '0',
        patt: '0',
        matt: '0',
        weapon_type: '0',
        critical: '0',
        hit_mod: '0',
        avoid_mod: BASE_STATS.lhand.avoid_mod,
        shield_pdef: BASE_STATS.lhand.pdef,
        shield_rate: BASE_STATS.lhand.shield_rate,
        speed: '0',
        mp_consume: '0',
        SS_count: '0',
        SPS_count: '0',
        curvature: '1000',
        UNK_2: '0',
        is_hero: '-1',
        UNK_3: '0',
        effA: '',
        effB: '',
      })
    }

    return items
      .map(
        item => {
          const dummyObject = Object.keys(WeaponGRP).reduce(
            (acc, key, i) => {
              acc[key as keyof typeof acc] = item[key as keyof typeof item] || ''
              return acc
            },
            {} as Record<keyof typeof WeaponGRP, string>,
          )

          return dummyObject
        },
        [] as Array<typeof WeaponGRP>,
      )
      .map(item =>
        Object.keys(item)
          .map(key => item[key as keyof typeof item])
          .join('\t'),
      )
  }
}

export class SkillGrpGenerator extends BaseGenerator implements TSVGenerator {
  constructor() {
    super(system_headers.skillgrp.split('\t'))
  }

  generate(data: ItemSetData, ids: CalculatedIds): string {
    const rows = this.generateRows(data, ids)
    return `${this.getHeaders()}\n${rows.join('\n')}`
  }

  generateRows(data: ItemSetData, ids: CalculatedIds): string[] {
    const skillId = ids.setId + 1000
    const shieldSkillId = ids.setId + 1001
    const enchantSkillId = ids.setId + 1002

    const skills: Array<Partial<typeof SkillGRP>> = [
      {
        skill_id: String(skillId),
        skill_level: '1',
        oper_type: '2',
        mp_consume: '0',
        cast_range: '-1',
        cast_style: '0',
        hit_time: '0',
        is_magic: '0',
        ani_char: '',
        desc: 'Gives Boosts all stats by 15%.',
        icon_name: 'icon.armor_t88_u_i00',
        extra_eff: '0',
        is_ench: '0',
        ench_skill_id: '0',
        hp_consume: '0',
        UNK_0: '-1',
        UNK_1: '-1',
      },
      {
        skill_id: String(shieldSkillId),
        skill_level: '1',
        oper_type: '2',
        mp_consume: '0',
        cast_range: '-1',
        cast_style: '0',
        hit_time: '0',
        is_magic: '0',
        ani_char: '',
        desc: 'Increases defense by 100.',
        icon_name: 'icon.skill0091',
        extra_eff: '0',
        is_ench: '0',
        ench_skill_id: '0',
        hp_consume: '0',
        UNK_0: '-1',
        UNK_1: '-1',
      },
      {
        skill_id: String(enchantSkillId),
        skill_level: '1',
        oper_type: '2',
        mp_consume: '0',
        cast_range: '-1',
        cast_style: '0',
        hit_time: '0',
        is_magic: '0',
        ani_char: '',
        desc: 'Increases the resistance of the wielder in 5%.',
        icon_name: 'icon.skill0231',
        extra_eff: '0',
        is_ench: '0',
        ench_skill_id: '0',
        hp_consume: '0',
        UNK_0: '-1',
        UNK_1: '-1',
      },
    ]

    return skills.map(skill => Object.values(skill).join('\t'))
  }
}

export class SkillNameGenerator extends BaseGenerator implements TSVGenerator {
  constructor() {
    super(system_headers.skillname.split('\t'))
  }

  generate(data: ItemSetData, ids: CalculatedIds): string {
    const rows = this.generateRows(data, ids)
    return `${this.getHeaders()}\n${rows.join('\n')}`
  }

  generateRows(data: ItemSetData, ids: CalculatedIds): string[] {
    const skillId = ids.setId + 1000
    const shieldSkillId = ids.setId + 1001
    const enchantSkillId = ids.setId + 1002

    const skills: Array<Partial<typeof SkillName>> = [
      {
        id: String(skillId),
        level: '1',
        name: `${data.setName} Armor Set`,
        description: data.setBonusDesc.trim(),
        desc_add1: 'Boosts all stats by 15%.',
        desc_add2: 'Only for the wielder when full set is equipped.',
      },
      {
        id: String(shieldSkillId),
        level: '1',
        name: 'Equipped with Shield',
        description: data.shieldBonusDesc.trim() || 'Additional resistance.',
        desc_add1: 'Boosts defense by 100.',
        desc_add2: 'Shield required to be equipped with the set.',
      },
      {
        id: String(enchantSkillId),
        level: '1',
        name: 'Enchant Heavy Armor (Grade S)',
        description: data.enchantBonusDesc.trim(),
        desc_add1: 'Gives 5% to all stats.',
        desc_add2: 'Applied to the wielder when full set is enchanted to +6.',
      },
    ]

    return skills.map(skill => Object.values(skill).join('\t'))
  }
}
