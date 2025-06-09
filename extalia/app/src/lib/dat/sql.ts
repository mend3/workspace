import { columnTypes } from './columns'
import { ddls, EnabledFiles, getHeader, mapper, mappings } from './schemas'

export const generateSqlParams = <T extends string | number | boolean | Date | null | unknown, F extends EnabledFiles>(
  clone: { [key: Lowercase<string>]: T },
  fileType: F,
): Record<string, T> => {
  const withValues: Record<string, { value: T }> = {} as Record<string, { value: T }>

  const mapping = mappings[fileType as EnabledFiles] ?? {}

  const clonedObject = Object.entries(clone).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [mapping[key as keyof typeof mapping] ?? key]: value,
    }),
    {} as Record<string, T>,
  )

  const fields = Object.keys(clonedObject).map(mapper)

  for (const { lowercase, pascal, field } of fields) {
    if (field.indexOf('[') >= 0) continue

    try {
      const parserKey = mapping[lowercase as keyof typeof mapping] ?? (lowercase as keyof typeof mapping)
      let _class = columnTypes[pascal]

      if (!_class) continue

      const _value = _class.fromId(String(clonedObject[field as keyof typeof clonedObject]))

      if (_value) withValues[parserKey] = _value as { value: T }
    } catch (error) {
      console.error(`Failed to inject ${field}->${pascal} parser`, (error as Error).message)
    }
  }

  const systemFiles = Object.keys(ddls).map(file => ({
    file: file as keyof typeof ddls,
    header: getHeader(file).split('\t').map(mapper),
    sql: ddls[file as keyof typeof ddls].split(', ').map(mapper),
  }))

  const file = systemFiles.find(sf => sf.file === fileType)
  if (!file) {
    return {} as Record<string, T>
    throw new Error(`Invalid fileType [${fileType}]`)
  }

  const sqlFields = file.sql.map(({ field }) => field)

  const cloneFields = Object.keys(withValues)
    .map(mapper)
    .map(({ field, ...rest }) => ({
      type: 'dat',
      ...rest,
      field,
      value: withValues[rest.lowercase]?.value ?? clonedObject[rest.lowercase],
    }))

  let sql: Record<string, T> = {}

  sqlFields
    .map(mapper)
    .map(({ field, ...rest }) => ({
      type: 'sql',
      ...rest,
      field,
      value: clonedObject[field as keyof typeof clonedObject],
    }))
    .forEach(({ field, hash }, _i) => {
      const fromClone = cloneFields.find(({ hash: b64 }) => b64 === hash)
      if (fromClone) {
        sql[field] = fromClone.value
      }
    })

  return sql
}
