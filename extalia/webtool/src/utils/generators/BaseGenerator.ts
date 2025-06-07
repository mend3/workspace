import { CalculatedIds, FileGenerator, ItemSetData } from '@/lib/itemset'

export abstract class BaseGenerator implements FileGenerator {
  protected headers: string[]

  constructor(headers: string[]) {
    this.headers = headers
  }

  abstract generate(data: ItemSetData, ids: CalculatedIds): string

  protected getHeaders(): string {
    return this.headers.join('\t')
  }

  generateHeaders(): string {
    return this.getHeaders()
  }
}
