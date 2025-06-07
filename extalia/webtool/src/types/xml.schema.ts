import { z } from 'zod'

// Base Schemas (EMPTY elements or simple structures)
const usingAttributesSchema = z
  .object({
    slotitem: z.string().optional(),
    kind: z.string().optional(),
  })
  .describe('Attributes for the <using> element.')
const usingSchema = z
  .object({
    _attributes: usingAttributesSchema,
  })
  .describe('Represents the <using> element, specifying item usage conditions.')

const targetAttributesSchema = z
  .object({
    using: z.string().optional(),
  })
  .describe('Attributes for the <target> element.')
const targetSchema = z
  .object({
    _attributes: targetAttributesSchema,
  })
  .describe('Represents the <target> element, specifying target conditions.')
const augmentationAttributesSchema = z
  .object({
    id: z.string(),
  })
  .describe('Attributes for the <augmentation> element.')
const statAttributesSchema = z
  .object({
    name: z.string().optional(),
  })
  .passthrough()
  .describe('Attributes for the <stat> element.')

const enchantAttributesSchema = z
  .object({
    val: z.string(),
    order: z.string().optional(),
    stat: z.string(),
  })
  .describe('Attributes for the <enchant> element.')
const enchantSchema = z
  .object({
    _attributes: enchantAttributesSchema,
  })
  .describe('Represents the <enchant> element for enchantment effects.')

// Forward declaration for recursive types (and/or)
// Need to use z.ZodType<any> for forward declaration
let andSchema: z.ZodType<any>
let orSchema: z.ZodType<any>

// Condition Schemas
const notSchema = z
  .object({
    using: z.array(usingSchema).optional(),
  })
  .passthrough()
  .describe('Represents the <not> element for negative conditions.')

// Define 'and' schema structure
// We assume a structure where child elements are grouped by tag name
andSchema = z
  .object({
    using: z.array(usingSchema).optional(),
    target: z.array(targetSchema).optional(),
    not: z.array(notSchema).optional(),
  })
  .passthrough()
  .describe('Represents the <and> element, combining conditions.')

// Define 'or' schema structure using lazy initialization
orSchema = z.lazy(() =>
  z
    .object({
      and: z.array(andSchema).optional(),
    })
  .passthrough()
    .describe('Represents the <or> element, allowing alternative conditions.'),
)

// Modifier Schemas (add, div, sub, mul)
const addAttributesSchema = z
  .object({
    val: z.string(),
    order: z.string(), // Required
    stat: z.string(),
  })
  .describe('Attributes for the <add> element.')
const addSchema = z
  .object({
    _attributes: addAttributesSchema,
    // Children grouped by tag name
    and: z.array(andSchema).optional(),
    or: z.array(orSchema).optional(),
  })
  .passthrough()
  .describe('Represents the <add> element for additive stat modifications.')

const divAttributesSchema = z
  .object({
    val: z.string(),
    order: z.string().optional(), // Implied
    stat: z.string(),
  })
  .describe('Attributes for the <div> element.')
const divSchema = z
  .object({
    _attributes: divAttributesSchema,
    and: z.array(andSchema).optional(),
    or: z.array(orSchema).optional(),
  })
  .passthrough()
  .describe('Represents the <div> element for division-based stat modifications.')

const subAttributesSchema = z
  .object({
    val: z.string(),
    order: z.string().optional(), // Implied
    stat: z.string(),
  })
  .describe('Attributes for the <sub> element.')
const subSchema = z
  .object({
    _attributes: subAttributesSchema,
    and: z.array(andSchema).optional(),
    or: z.array(orSchema).optional(),
  })
  .describe('Represents the <sub> element for subtractive stat modifications.')

const mulAttributesSchema = z
  .object({
    val: z.string(),
    order: z.string().optional(), // Implied
    stat: z.string(),
  })
  .describe('Attributes for the <mul> element.')
const mulSchema = z
  .object({
    _attributes: mulAttributesSchema,
    and: z.array(andSchema).optional(),
    or: z.array(orSchema).optional(),
  })
  .describe('Represents the <mul> element for multiplicative stat modifications.')

// Container Schemas (for, item)
const forSchema = z
  .object({
    // Children grouped by tag name
    add: z.array(addSchema).optional(),
    mul: z.array(mulSchema).optional(),
    enchant: z.array(enchantSchema).optional(),
    sub: z.array(subSchema).optional(),
    div: z.array(divSchema).optional(),
  })
  .passthrough()
  .describe('Represents the <for> element, grouping modifications.')

const itemAttributesSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .describe('Attributes for the <item> element.')
const itemSchema = z
  .object({
    _attributes: itemAttributesSchema,
    // Children grouped by tag name
    for: z.array(forSchema).optional(),
    add: z.array(addSchema).optional(),
    sub: z.array(subSchema).optional(),
    div: z.array(divSchema).optional(),
    mul: z.array(mulSchema).optional(),
  })
  .passthrough()
  .describe('Represents an <item> element, defining an item and its properties.')
const augmentationSchema = z
  .object({
    _attributes: augmentationAttributesSchema,
  })
  .passthrough()
  .describe('Represents an <augmentation> element, defining an augmentation and its properties.')
const statSchema = z
  .object({
    _attributes: statAttributesSchema,
    table: z.array(z.object({ '#text': z.string() }).passthrough()),
  })
  .passthrough()
  .describe('Represents the <stat> element, specifying stat conditions.')

// Root Schema (list)
// Assumes the parsed JSON structure will be { list: { item: [...] } }
const listContentSchema = z
  .object({
    item: z.array(itemSchema).optional(), // DTD: (item)* -> optional array
    skill: z.array(itemSchema).optional(), // DTD: (item)* -> optional array
    augmentation: z.array(augmentationSchema).optional(), // DTD: (item)* -> optional array
    stat: z.array(statSchema).optional(), // DTD: (item)* -> optional array
  })
  .describe('Content of the root <list> element.')

const xmlSchema = z
  .object({
    list: listContentSchema,
  })
  .describe('Root schema for the armors DTD, representing the <list> element.')

export type XmlSchema = z.infer<typeof xmlSchema>

// Export the root schema
export default xmlSchema

// Example usage (optional, for testing)
/*
const exampleData = {
  list: {
    item: [
      {
        _attributes: { id: "1", name: "Helmet" },
        add: [
          {
            _attributes: { val: "10", order: "1", stat: "pDef" },
            and: [
              { using: [{ _attributes: { kind: "HeavyArmor" } }] }
            ]
          }
        ]
      }
    ]
  }
};

try {
  armorsSchema.parse(exampleData);
  console.log("Validation successful!");
} catch (e) {
  console.error("Validation failed:", e);
}
*/
