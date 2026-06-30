// CONTROLLER for the file field components: the only place they hit the API (eslint layer boundary).
import { recordsApi } from '~/lib/api/client'
import type { RecordFileDto } from '~/types/dto'

/** Current files attached to a record's file field. */
export async function loadFiles(recordId: number, fieldKey: string): Promise<RecordFileDto[]> {
  const record = await recordsApi.get(recordId)
  return record.files?.[fieldKey] ?? []
}

/** Attach a file; returns the field's updated file list. */
export async function uploadFile(recordId: number, fieldKey: string, file: File): Promise<RecordFileDto[]> {
  const record = await recordsApi.uploadFile(recordId, fieldKey, file)
  return record.files?.[fieldKey] ?? []
}

export async function removeFile(recordId: number, mediaId: number): Promise<void> {
  await recordsApi.deleteFile(recordId, mediaId)
}
