// CONTROLLER: business logic + API calls for the RecordCard use-case.
// Fetches DTOs, maps them into a collection of RecordCardModel, and assigns to the store.
// Imports the API client + store; never imported by the .vue beyond its declared functions.
import { recordsApi } from '~/lib/api/client'
import { toRecordCardModel, type RecordCardModel } from './RecordCard.model'

/** Fetch records for an entity type and return a typed collection of card models. */
export async function loadRecordCards(entityType: string): Promise<RecordCardModel[]> {
  const { data } = await recordsApi.list(entityType)
  return data.map(toRecordCardModel)
}
