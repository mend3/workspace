import path from 'path'
import { txt2json } from './dat/reader'
import {
  PKBinding,
  primaryColumns,
  relations,
  rowSchema,
  SystemFileName,
  SystemRow,
  TraversalResult,
} from './dat/schemas'
import { generateSqlParams } from './dat/sql'

/**
 * Returns the path to the static directory.
 * @param filePath - The path to the file.
 * @returns The path to the static directory.
 */
const staticDir = (...filePath: string[]) => path.resolve(path.join(process.cwd(), ...filePath))

/**
 * CSVRepository streams every record from a file.
 */
export class TxtRepository {
  private _relations: Record<keyof typeof relations, PKBinding[]>
  private _visited: Set<string> = new Set()

  constructor() {
    this._relations = Object.keys(relations).reduce(
      (all, leftFile) => {
        return {
          ...all,
          [leftFile]: relations[leftFile as keyof typeof relations] as PKBinding[],
        }
      },
      {} as Record<keyof typeof relations, PKBinding[]>,
    )
  }

  /**
   * Lookup a record in the system file.
   * @param file - The file to lookup.
   * @param visited - The set of visited records.
   * @param fn - The function to filter the records.
   * @returns The generator of the records.
   */
  async *lookup(file: SystemFileName, fn: (record: SystemRow) => boolean): AsyncGenerator<TraversalResult> {
    const filePath = staticDir('public/system', `${file}.txt`)
    const generator = txt2json(filePath, file, rowSchema, '\t')

    for await (const record of generator) {
      const related: TraversalResult[] = []
      try {
        if (record && fn(record)) {
          const cacheKey = `${record.__source}:${record.__hash}`
          if (this._visited.has(cacheKey)) {
            continue
          }
          this._visited.add(cacheKey)

          // Retrieve the relationships for this file from the final relationship model.
          const relationships = this._relations[file] || []
          for (const relation of relationships) {
            // Lookup the target record using the foreign key value.
            const leftValue = record[relation.pkField]

            const generator = this.lookup(relation.filename, row => {
              return fn(row) || String(row[relation.joinField]) === String(leftValue)
            })
            for await (const targetRecord of generator) {
              if (targetRecord) {
                related.push(targetRecord)
              }
            }
          }

          // Special handling: if the record has set_ids (or set_extra_id), try looking up additional related pieces.
          const setIds = [...(record.set_ids ?? []), record.set_extra_id].filter(Boolean) as string[]
          if (setIds.length > 0) {
            for (const piece_id of setIds) {
              const generator = this.lookup('itemname', row => fn(row) || String(row.id) === String(piece_id))
              for await (const pieceRecord of generator) {
                if (pieceRecord) {
                  related.push(pieceRecord)
                }
              }
            }
          }

          const sql = generateSqlParams(record, file as any)
          const traversalResult: TraversalResult = { file, sql, record, related }
          yield traversalResult
        }
      } catch (error) {
        console.error('Error processing record from', file, error)
      }
    }
    return null
  }
}

// Function to consume the async generator
async function consumeGenerator() {
  Object.entries(primaryColumns)
    .filter(([file, columns]) => columns.length > 0)
    .forEach(async ([file, columns]) => {
      for await (const item of new TxtRepository().lookup(file as keyof typeof primaryColumns, row =>
        columns.some(col => row[col] === 9209),
      )) {
        console.log(item)
      }
    })
}

// Call the consumer
// consumeGenerator().catch(console.error);
