import 'reflect-metadata'

type NodeEnv = 'development' | 'production' | 'test'

declare global {
  interface Window {
    mcpHelper: {
      logs: string[]
      originalConsole: Partial<typeof console>
    }
  }
  interface ObjectConstructor {
    entries<U, T extends string | number | symbol>(o: { [key in T]: U } | ArrayLike<U>): [T, U][]
    keys<T>(obj: T): (keyof T)[]
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NodeEnv
    }
  }

  type DeepPartial<T> =
    | T
    | (T extends Array<infer U>
      ? DeepPartial<U>[]
      : T extends Map<infer K, infer V>
      ? Map<DeepPartial<K>, DeepPartial<V>>
      : T extends Set<infer M>
      ? Set<DeepPartial<M>>
      : T extends object
      ? {
        [K in keyof T]?: DeepPartial<T[K]>
      }
      : T)

  type OmitValue<T, U> = Pick<T, ExcludeKeys<T, U>>
  type Unpacked<T> = T extends (infer U)[] ? U : T
  type NoNullable<T> = Exclude<T, undefined | null>
  type InnerType<T> = NoNullable<Unpacked<T>>
  type ExcludeKeys<T, U> = NoNullable<
    {
      [P in keyof T]: InnerType<T[P]> extends U ? never : P
    }[keyof T]
  >
  type ExtractKeys<T, U> = NoNullable<
    {
      [P in keyof T]: InnerType<T[P]> extends U ? P : never
    }[keyof T]
  >
  type OmitBy<T, U> = Omit<T, ExtractKeys<T, U>>
  type PickBy<T, U> = Pick<T, ExtractKeys<T, U>>
  type UncapitalizeKeys<T extends object> = Uncapitalize<keyof T & string>
  type UncapitalizeObjectKeys<T extends object> = {
    [key in UncapitalizeKeys<T>]: Capitalize<key> extends keyof T ? T[Capitalize<key>] : never
  }

  type Serializable =
    | string
    | number
    | bigint
    | boolean
    | Date
    | {
      [key: string]: Serializable
    }
    | Serializable[]
    | null
    | undefined

  type JSONObject = {
    [x: string]: Serializable
  }

  type Constructor<T = any> = new (...args: any[]) => T

  type ClassConstructor<T = Constructor> = T extends new (...args: any[]) => infer R ? Constructor<R> : never


  /**
   * A utility type that maps a record of constructors to a record of their instance types.
   *
   * @template T - A record mapping keys to constructor functions.
   * @returns An object type mapping each key in T to the instance type produced by the constructor.
   */
  type InstanceTypeMap<T> = {
    [K in keyof T]: T[K] extends new (...args: any[]) => infer R ? R : never
  }

  /**
   * Represents an object that can run, with max retries.
   *
   */
  interface Runnable<T = any> {
    run(): Promise<T>
    maxRetries: number
  }

  /**
   * Represents an object that can execute a request action
   */
  interface Requestable<T> {
    request(): Promise<T> // Each callable must return a value of type T
  }

  /**
   * Represents an object that can be compared to another.
   *
   */
  interface Equatable {
    /**
     * Returns `true` if the two objects are equal, `false` otherwise.
     *
     * @param {Equatable} object - The object to compare for equality.
     * @returns {boolean} - `true` if the objects are equal, otherwise `false`.
     */
    equals(object: Equatable): boolean
  }
}


export { }

