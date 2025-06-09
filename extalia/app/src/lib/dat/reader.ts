import { v5 as uuid } from 'uuid'
import fs from 'fs'
import readline from 'readline'
import z from 'zod'
import { SystemRow } from './schemas'

/**
 * Async generator function that reads a txt file line by line,
 * parses each line into a JSON object, and yields the object.
 *
 * @param filePath path to the txt file
 * @param __source source of the data
 * @param schema zod schema
 * @param separator "," for txt/csv, "\t" for tsv
 */
export async function* txt2json<T extends z.ZodType<any, any, Pick<SystemRow, '__source' | '__hash'>>>(
  filePath: string,
  __source: string,
  schema: T,
  separator: string,
): AsyncGenerator<z.infer<T>, void, unknown> {
  const fileStream = fs.createReadStream(filePath, 'utf-8')
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  let headers: string[] = []

  for await (const line of rl) {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('//') || line.trim().startsWith('#')) continue

    if (!headers.length) {
      headers = line.split(separator)
    } else {
      const values = line.split(separator)

      let tmp = {} as Record<string, unknown>
      for (let i = 0; i < headers.length; i++) {
        tmp[headers[i]] = values[i] || ''
      }
      const __hash = uuid(JSON.stringify(tmp), uuid.URL)
      const obj: z.infer<T> = { __source, __hash, ...tmp }

      const isValid = (
        output: z.SafeParseReturnType<
          {
            __source: string
            __hash: string
          },
          SystemRow
        >,
      ): output is z.SafeParseSuccess<z.infer<T>> => !output.error

      const parseOutput = schema.safeParse(obj)
      if (isValid(parseOutput)) {
        yield parseOutput.data
      }
    }
  }

  fileStream.close()
}
