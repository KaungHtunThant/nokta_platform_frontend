// MODEL (type + builder) for the RecordList use-case. Picks a primary label field from the
// schema (first text field, else first field) so the list stays entity-generic: no hard-coded
// "title" column, no entity-specific code. Pure function -> unit-testable (no DOM).
import type { EntitySchemaDto, FieldDto } from '~/types/schema'
import type { RecordDto } from '~/types/dto'

export interface RecordRowVm {
  id: number
  title: string
  status: string
}

function primaryField(schema: EntitySchemaDto): FieldDto | undefined {
  return schema.fields.find(f => f.type === 'text') ?? schema.fields[0]
}

/** Map records to compact row view-models, labelling each by the schema's primary field. */
export function buildRows(schema: EntitySchemaDto, records: RecordDto[]): RecordRowVm[] {
  const primary = primaryField(schema)

  return records.map((r) => {
    const label = primary ? r.data[primary.key] : null
    return {
      id: r.id,
      title: label === null || label === undefined || label === '' ? `#${r.id}` : String(label),
      status: r.status ?? '',
    }
  })
}
