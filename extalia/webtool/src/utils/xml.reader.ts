import { X2jOptions, XMLParser, XMLValidator } from 'fast-xml-parser'
import { promises as fs } from 'fs'
import * as path from 'path'
import { z } from 'zod'
import xmlSchema from '../types/xml.schema' // Import the Zod schema

/**
 * Async generator that recursively yields XML file paths in a directory.
 * Ignores .dtd files.
 */
async function* getXmlFiles(dir: string): AsyncGenerator<{ path: string; content: string }> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* getXmlFiles(fullPath)
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.xml') {
      const content = await fs.readFile(fullPath, 'utf-8')
      yield { path: fullPath, content }
    }
  }
}

// Configure the XML parser
const parser = new XMLParser({
  ignoreAttributes: false,
  attributesGroupName: '_attributes',
  attributeNamePrefix: '',
  allowBooleanAttributes: false,
  parseAttributeValue: false,
  trimValues: true,
  alwaysCreateTextNode: false,
  // isArray is often tricky; we'll handle array conversion manually after parsing
  // to ensure consistency regardless of whether an element appears once or multiple times.
})

// List of element names that should always be arrays based on the DTD/Schema
const alwaysArray = [
  'item',
  'augmentation',
  'stat',
  'skill',
  'for',
  'add',
  'sub',
  'div',
  'mul',
  'set',
  'and',
  'or',
  'not',
  'using',
  'table',
  'enchant1',
  'enchant2',
]

/**
 * Recursively ensures that specified keys in an object contain arrays.
 * If a key exists and its value is not an array, it wraps the value in an array.
 * @param obj The object to process.
 */
function ensureArrays(obj: any): void {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue
    }

    let value = obj[key]

    // If the key is one that should always be an array
    if (alwaysArray.includes(key)) {
      if (value !== undefined && !Array.isArray(value)) {
        obj[key] = [value] // Wrap single object in an array
      }
    }

    // Recurse into nested objects or arrays
    if (Array.isArray(value)) {
      value.forEach(ensureArrays)
    } else if (typeof value === 'object') {
      // Don't recurse into the _attributes object
      if (key !== '_attributes') {
        ensureArrays(value)
      }
    }
  }
}

/**
 * Parses an XML string and validates it against the Zod schema.
 * @param xmlString The XML string to parse.
 * @returns The validated JavaScript object.
 * @throws Error if XML is invalid or validation fails.
 */
function parseAndValidateXml(xmlString: string): z.infer<typeof xmlSchema> {
  // 1. Validate XML structure (optional but good practice)
  const validationResult = XMLValidator.validate(xmlString)
  if (validationResult !== true) {
    throw new Error(`Invalid XML: ${validationResult.err.msg} at line ${validationResult.err.line}`)
  }

  // 2. Parse XML to JavaScript object
  let parsedObj: any
  try {
    parsedObj = parser.parse(xmlString)
  } catch (error: any) {
    throw new Error(`XML parsing failed: ${error.message}`)
  }

  // 4. Validate the processed object with Zod schema
  try {
    if (parsedObj.list) {
      ensureArrays(parsedObj.list)
    } else {
      // Handle cases where the root might be different or parsing failed partially
      // This basic check assumes the root is always <list>
      ensureArrays(parsedObj)
    }
    return xmlSchema.parse(parsedObj)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log the object that failed validation for debugging
      // console.error("Object failed validation:", JSON.stringify(parsedObj, null, 2));
      throw error
    } else {
      throw new Error(`An unexpected error occurred during validation: ${error}`)
    }
  }
}

/**
 * Creates a ReadableStream that reads XML files from a specified directory,
 * @param rootDir The root directory to start reading XML files from.
 * @returns A ReadableStream that emits JSON objects representing the parsed XML files.
 */
export const getReadableStream = (rootDir: string) => {
  return new ReadableStream<string>({
    async start(controller) {
      try {
        for await (const file of getXmlFiles(rootDir)) {
          // Test the parser
          const relativePath = path.relative(rootDir, file.path)
          try {
            const parsedResponse = parseAndValidateXml(file.content)
            // Only send relative path for security
            controller.enqueue(
              JSON.stringify({
                path: path.relative(rootDir, file.path),
                content: parsedResponse,
              }) + '\n',
            )
          } catch (error: any) {
            console.error(`Error parsing [${relativePath}]`)
            // console.error(error)
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      } finally {
        // Ensure the stream is closed even if an error occurs
        controller.close()
      }
    },
  })
}
