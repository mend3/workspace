const SLOT_NONE = 0x0000
const SLOT_UNDERWEAR = 0x0001
const SLOT_CLOAK = 0x0003
const SLOT_R_EAR = 0x0002
const SLOT_L_EAR = 0x0004
const SLOT_NECK = 0x0008
const SLOT_R_FINGER = 0x0010
const SLOT_L_FINGER = 0x0020
const SLOT_HEAD = 0x0040
const SLOT_R_HAND = 0x0080
const SLOT_L_HAND = 0x0100
const SLOT_GLOVES = 0x0200
const SLOT_CHEST = 0x0400
const SLOT_LEGS = 0x0800
const SLOT_FEET = 0x1000
const SLOT_BACK = 0x2000
const SLOT_LR_HAND = 0x4000
const SLOT_FULL_ARMOR = 0x8000
const SLOT_HAIR = 0x010000
const SLOT_WOLF = 0x020000
const SLOT_HATCHLING = 0x100000
const SLOT_STRIDER = 0x200000
const SLOT_BABYPET = 0x400000
const SLOT_FACE = 0x040000
const SLOT_DHAIR = 0x080000

enum BodyParts {
  'chest' = SLOT_CHEST,
  'fullarmor' = SLOT_FULL_ARMOR,
  'head' = SLOT_HEAD,
  'hair' = SLOT_HAIR,
  'face' = SLOT_FACE,
  'dhair' = SLOT_DHAIR,
  'underwear' = SLOT_UNDERWEAR,
  'cloak' = SLOT_CLOAK,
  'back' = SLOT_BACK,
  'neck' = SLOT_NECK,
  'legs' = SLOT_LEGS,
  'feet' = SLOT_FEET,
  'gloves' = SLOT_GLOVES,
  'chest,legs' = SLOT_CHEST | SLOT_LEGS,
  'rhand' = SLOT_R_HAND,
  'lhand' = SLOT_L_HAND,
  'lrhand' = SLOT_LR_HAND,
  'rear,lear' = SLOT_R_EAR | SLOT_L_EAR,
  'rear' = SLOT_R_EAR,
  'lear' = SLOT_L_EAR,
  'rfinger,lfinger' = SLOT_R_FINGER | SLOT_L_FINGER,
  'none' = SLOT_NONE,
  'wolf' = SLOT_WOLF, // for wolf
  'hatchling' = SLOT_HATCHLING, // for hatchling
  'strider' = SLOT_STRIDER, // for strider
  'babypet' = SLOT_BABYPET, // for babypet
}

export class BodyPart {
  static readonly MASKS = Object.entries(BodyParts)
    .filter(([name]) => Number.isNaN(+name))
    .map(([name, value], slot) => new BodyPart(name as keyof typeof BodyParts, slot as BodyParts, +value))

  protected constructor(
    readonly value: keyof typeof BodyParts,
    readonly id: BodyParts,
    readonly mask: number,
  ) {}

  static fromId = (slot: string | number) => {
    if (Number.isNaN(slot)) throw new Error('Slot is not a valid number')

    const mask = BodyPart.MASKS.find(m => m.id === +slot)
    if (!mask) throw new Error(`Invalid slot: ${slot}`)

    return mask
  }
}
