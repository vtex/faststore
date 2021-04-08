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
   * Create or update entire document
   */
  upsert: (data: DataInput) => Promise<MasterDataSaveResponse>
  /**
   * Create or update partial document
   */
  upsertial: (data: DataInput) => Promise<MasterDataSaveResponse>
  /**
   * Update entire document
   */
  update: (id: string, data: DataInput) => Promise<MasterDataSaveResponse>
  /**
   * Get document
   */
  findUnique: (id: string) => Promise<unknown>
  /**
   * Delete document
   */
  delete: (id: string) => Promise<unknown>
}

type Method = 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT'

const fetchy = (
  url: string,
  method: Method,
  data?: DataInput
): Promise<MasterDataSaveResponse> =>
  new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/vnd.vtex.ds.v10+json',
      },
      method,
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        resolve(response.json())
      } else {
        reject(new Error())
      }
    })
  })

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
