export type DataInput = {
  [key: string]: unknown
}

export type MasterDataSaveResponse = {
  DocumentId: string
  Href: string
  Id: string
}

export type MasterData = (
  entity: string
) => {
  /**
   * Create a new document
   */
  create: (data: DataInput) => Promise<MasterDataSaveResponse>
  /**
   * `upsert` query updates a document if it exists, or creates a new.
   */
  upsert: (data: DataInput) => Promise<MasterDataSaveResponse>
  /**
   * Similar to `upsert`, the `upsertial` query updates partial data of
   * document if it exists, or creates a new.
   *
   * The difference is that data that is not requested for updating will
   * be kept.
   */
  upsertial: (data: DataInput) => Promise<MasterDataSaveResponse>
  /**
   * `update` updates an existing document.
   *
   * Similar to `upsert`, however it does not create a document does not exist.
   */
  update: (id: string, data: DataInput) => Promise<MasterDataSaveResponse>
  /**
   * `findUnique` method lets you retrieve a single document by id.
   */
  findUnique: (id: string) => Promise<unknown>
  /**
   * `delete` method deletes a document by id.
   */
  delete: (id: string) => Promise<unknown>
}

type Method = 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT'

const fetchy = async (
  url: string,
  method: Method,
  data?: DataInput
): Promise<MasterDataSaveResponse> => {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/vnd.vtex.ds.v10+json',
    },
    method,
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }

    return new Error()
  })
}

const masterDataApi: MasterData = (entity) => {
  const url = `/api/dataentities/${entity}/documents`

  return {
    // save data
    create: (data) => fetchy(url, 'POST', data),
    upsert: (data) => fetchy(url, 'PUT', data),
    upsertial: (data) => fetchy(url, 'PATCH', data),
    update: (id, data) => fetchy(`${url}/${id}`, 'PUT', data),
    // read data
    findUnique: (id) => fetchy(`${url}/${id}`, 'GET'),
    delete: (id) => fetchy(`${url}/${id}`, 'DELETE'),
  }
}

export default masterDataApi
