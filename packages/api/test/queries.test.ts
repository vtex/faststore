import supertest from 'supertest'

import app from '../local/server'
import {
  AllCollectionsFirst5Response,
  AllCollectionsQueryFirst5,
} from '../mocks/AllCollectionsQuery'
import {
  AllProductsFirst5Response,
  AllProductsQueryFirst5,
} from '../mocks/AllProductsQuery'
import {
  CollectionDesksQuery,
  CollectionDesksResponse,
} from '../mocks/CollectionQuery'
import { ProductByIdQuery, ProductByIdResponse } from '../mocks/ProductQuery'
import {
  Search5FirstProductsResponse,
  SearchQueryFirst5Products,
} from '../mocks/SearchQuery'

const request = supertest(app)

describe('Default queries', () => {
  it('`collection` query', async () => {
    const response = await request
      .post('/graphql')
      .send({
        query: CollectionDesksQuery,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body).toEqual(CollectionDesksResponse)
  })

  it('`product` query', async () => {
    const response = await request
      .post('/graphql')
      .send({
        query: ProductByIdQuery,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body).toEqual(ProductByIdResponse)
  })

  it('`search` query', async () => {
    const response = await request
      .post('/graphql')
      .send({
        query: SearchQueryFirst5Products,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body).toEqual(Search5FirstProductsResponse)
  })

  it('`allCollections` query', async () => {
    const response = await request
      .post('/graphql')
      .send({
        query: AllCollectionsQueryFirst5,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body).toEqual(AllCollectionsFirst5Response)
  })

  it('`allProducts` query', async () => {
    const response = await request
      .post('/graphql')
      .send({
        query: AllProductsQueryFirst5,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body).toEqual(AllProductsFirst5Response)
  })
})
