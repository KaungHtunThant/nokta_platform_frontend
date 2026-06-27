// MODEL (type) for the RecordCard util/use-case. One model per util; the SAME entity may have
// other models elsewhere (e.g. RecordDetailModel). The type a util produces === the type its
// store slice stores. Includes the DTO -> Model mapper (the ONLY DTO->Model crossing).
import type { RecordDto } from '~/types/dto'

export interface RecordCardModel {
  id: number
  title: string
  stageId: number | null
  ownerId: number | null
  updatedAt: string
}

/** Map a raw API DTO into the precise card model. Data + trivial derivation only. */
export function toRecordCardModel(dto: RecordDto): RecordCardModel {
  return {
    id: dto.id,
    title: String(dto.data.title ?? dto.data.name ?? `#${dto.id}`),
    stageId: dto.stage_id,
    ownerId: dto.owner_id,
    updatedAt: dto.updated_at,
  }
}
