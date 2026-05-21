import { describe, expect, it, vi } from 'vitest'

import { BadRequestError } from '../../../../../src/platforms/errors'
import { getOrderEntryOperation } from '../../../../../src/platforms/vtex/resolvers/getOrderEntryOperation'
import { getOrderFormItems } from '../../../../../src/platforms/vtex/resolvers/getOrderFormItems'
import { startOrderEntryOperation } from '../../../../../src/platforms/vtex/resolvers/startOrderEntryOperation'
import { uploadFileToOrderEntry } from '../../../../../src/platforms/vtex/resolvers/uploadFileToOrderEntry'

const makeContext = (overrides = {}) => ({
  clients: {
    commerce: {
      orderEntry: {
        getOperation: vi.fn(),
        getOrderFormItems: vi.fn(),
        uploadFile: vi.fn(),
        createOrderForm: vi.fn(),
        startOperation: vi.fn(),
      },
    },
  },
  ...overrides,
})

describe('getOrderEntryOperation', () => {
  it('throws BadRequestError when operationId is missing', async () => {
    const ctx = makeContext()
    await expect(
      getOrderEntryOperation(null, { operationId: '' }, ctx as any)
    ).rejects.toThrow(BadRequestError)
  })

  it('calls commerce.orderEntry.getOperation with operationId', async () => {
    const ctx = makeContext()
    const mockResult = { status: 'SUCCESS', entityId: 'abc' }
    ctx.clients.commerce.orderEntry.getOperation.mockResolvedValueOnce(
      mockResult
    )

    const result = await getOrderEntryOperation(
      null,
      { operationId: 'op-123' },
      ctx as any
    )

    expect(ctx.clients.commerce.orderEntry.getOperation).toHaveBeenCalledWith({
      operationId: 'op-123',
    })
    expect(result).toEqual(mockResult)
  })
})

describe('getOrderFormItems', () => {
  it('throws BadRequestError when orderFormId is missing', async () => {
    const ctx = makeContext()
    await expect(
      getOrderFormItems(null, { orderFormId: '' }, ctx as any)
    ).rejects.toThrow(BadRequestError)
  })

  it('returns mapped items from commerce client', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.orderEntry.getOrderFormItems.mockResolvedValueOnce({
      items: [
        {
          id: 'sku-1',
          name: 'Product A',
          price: 100,
          listPrice: 120,
          quantity: 2,
          imageUrl: 'https://example.com/img.jpg',
          availability: 'available',
          seller: '1',
          unitMultiplier: 1,
        },
      ],
    })

    const result = await getOrderFormItems(
      null,
      { orderFormId: 'of-123' },
      ctx as any
    )

    expect(result).toEqual([
      {
        id: 'sku-1',
        name: 'Product A',
        price: 100,
        listPrice: 120,
        quantity: 2,
        imageUrl: 'https://example.com/img.jpg',
        availability: 'available',
        seller: '1',
        unitMultiplier: 1,
      },
    ])
  })

  it('returns empty array when items is null', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.orderEntry.getOrderFormItems.mockResolvedValueOnce({
      items: null,
    })

    const result = await getOrderFormItems(
      null,
      { orderFormId: 'of-123' },
      ctx as any
    )

    expect(result).toEqual([])
  })

  it('defaults imageUrl to null and unitMultiplier to 1 when missing', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.orderEntry.getOrderFormItems.mockResolvedValueOnce({
      items: [
        {
          id: 'sku-2',
          name: 'Product B',
          price: 50,
          listPrice: 60,
          quantity: 1,
          imageUrl: undefined,
          availability: 'available',
          seller: '1',
          unitMultiplier: undefined,
        },
      ],
    })

    const result = await getOrderFormItems(
      null,
      { orderFormId: 'of-456' },
      ctx as any
    )

    expect(result[0].imageUrl).toBeNull()
    expect(result[0].unitMultiplier).toBe(1)
  })
})

describe('uploadFileToOrderEntry', () => {
  it('throws BadRequestError when fileContent is missing', async () => {
    const ctx = makeContext()
    await expect(
      uploadFileToOrderEntry(
        null,
        {
          data: { fileContent: '', fileName: 'test.csv', mimeType: 'text/csv' },
        },
        ctx as any
      )
    ).rejects.toThrow(BadRequestError)
  })

  it('throws BadRequestError when fileName is missing', async () => {
    const ctx = makeContext()
    await expect(
      uploadFileToOrderEntry(
        null,
        { data: { fileContent: 'abc', fileName: '', mimeType: 'text/csv' } },
        ctx as any
      )
    ).rejects.toThrow(BadRequestError)
  })

  it('throws BadRequestError when mimeType is missing', async () => {
    const ctx = makeContext()
    await expect(
      uploadFileToOrderEntry(
        null,
        { data: { fileContent: 'abc', fileName: 'test.csv', mimeType: '' } },
        ctx as any
      )
    ).rejects.toThrow(BadRequestError)
  })

  it('calls uploadFile with decoded buffer and returns result', async () => {
    const ctx = makeContext()
    const mockResult = { objectKey: 's3-key-123' }
    ctx.clients.commerce.orderEntry.uploadFile.mockResolvedValueOnce(mockResult)

    const fileContent = Buffer.from('SKU,Qty\n001,5').toString('base64')
    const result = await uploadFileToOrderEntry(
      null,
      { data: { fileContent, fileName: 'items.csv', mimeType: 'text/csv' } },
      ctx as any
    )

    expect(ctx.clients.commerce.orderEntry.uploadFile).toHaveBeenCalledWith({
      fileBuffer: Buffer.from(fileContent, 'base64'),
      fileName: 'items.csv',
      mimeType: 'text/csv',
    })
    expect(result).toEqual(mockResult)
  })
})

describe('startOrderEntryOperation', () => {
  it('throws BadRequestError when objectKey is missing', async () => {
    const ctx = makeContext()
    await expect(
      startOrderEntryOperation(
        null,
        { data: { objectKey: '', orderFormId: 'of-1' } },
        ctx as any
      )
    ).rejects.toThrow(BadRequestError)
  })

  it('throws BadRequestError when data is null', async () => {
    const ctx = makeContext()
    await expect(
      startOrderEntryOperation(null, { data: null as any }, ctx as any)
    ).rejects.toThrow(BadRequestError)
  })

  it('creates order form and starts operation', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.orderEntry.createOrderForm.mockResolvedValueOnce({
      orderFormId: 'of-new',
    })
    const mockResult = { operationId: 'op-456' }
    ctx.clients.commerce.orderEntry.startOperation.mockResolvedValueOnce(
      mockResult
    )

    const result = await startOrderEntryOperation(
      null,
      {
        data: {
          objectKey: 'key-abc',
          orderFormId: 'of-1',
          sessionToken: 'tok-123',
        },
      },
      ctx as any
    )

    expect(
      ctx.clients.commerce.orderEntry.createOrderForm
    ).toHaveBeenCalledTimes(1)
    expect(ctx.clients.commerce.orderEntry.startOperation).toHaveBeenCalledWith(
      {
        objectKey: 'key-abc',
        orderFormId: 'of-new',
        sessionToken: 'tok-123',
      }
    )
    expect(result).toEqual(mockResult)
  })

  it('passes undefined sessionToken when not provided', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.orderEntry.createOrderForm.mockResolvedValueOnce({
      orderFormId: 'of-new',
    })
    ctx.clients.commerce.orderEntry.startOperation.mockResolvedValueOnce({
      operationId: 'op-789',
    })

    await startOrderEntryOperation(
      null,
      { data: { objectKey: 'key-xyz', orderFormId: 'of-1' } },
      ctx as any
    )

    expect(ctx.clients.commerce.orderEntry.startOperation).toHaveBeenCalledWith(
      expect.objectContaining({ sessionToken: undefined })
    )
  })
})
