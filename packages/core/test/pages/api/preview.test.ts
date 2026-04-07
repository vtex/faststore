import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import type { NextApiRequest, NextApiResponse } from 'next'

import handler from '../../../src/pages/api/preview'
import { contentService } from '../../../src/server/content/service'

const createResponse = () => {
  const res = {
    clearPreviewData: jest.fn(),
    setPreviewData: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn().mockReturnThis(),
    end: jest.fn(),
  }

  return res as unknown as NextApiResponse & typeof res
}

describe('/api/preview', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('stores the requested locale in the preview session data', async () => {
    jest
      .spyOn(contentService, 'getSingleContent')
      .mockResolvedValue({} as never)

    const req = {
      query: {
        contentType: 'home',
        documentId: 'entry-1',
        versionId: 'branch-1',
        locale: 'pt-BR',
      },
    } as unknown as NextApiRequest
    const res = createResponse()

    await handler(req, res)

    expect(contentService.getSingleContent).toHaveBeenCalledWith({
      contentType: 'home',
      documentId: 'entry-1',
      versionId: 'branch-1',
      previewData: {
        contentType: 'home',
        documentId: 'entry-1',
        versionId: 'branch-1',
      },
      locale: 'pt-BR',
      releaseId: undefined,
      slug: undefined,
    })
    expect(res.setPreviewData).toHaveBeenCalledWith(
      {
        contentType: 'home',
        documentId: 'entry-1',
        versionId: 'branch-1',
        locale: 'pt-BR',
      },
      {
        maxAge: 3600,
        path: '/',
      }
    )
    expect(res.redirect).toHaveBeenCalledWith('/')
  })

  it('keeps preview session data locator-only when locale is absent', async () => {
    jest
      .spyOn(contentService, 'getSingleContent')
      .mockResolvedValue({} as never)

    const req = {
      query: {
        contentType: 'home',
        documentId: 'entry-1',
        versionId: 'branch-1',
      },
    } as unknown as NextApiRequest
    const res = createResponse()

    await handler(req, res)

    expect(res.setPreviewData).toHaveBeenCalledWith(
      {
        contentType: 'home',
        documentId: 'entry-1',
        versionId: 'branch-1',
      },
      {
        maxAge: 3600,
        path: '/',
      }
    )
  })
})
