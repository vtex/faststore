import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import handler from '../../../src/pages/api/preview'
import { contentService } from '../../../src/server/content/service'

const createResponse = () => {
  const res = {
    clearPreviewData: vi.fn(),
    setPreviewData: vi.fn(),
    redirect: vi.fn(),
    status: vi.fn().mockReturnThis(),
    end: vi.fn(),
  }

  return res as unknown as NextApiResponse & typeof res
}

describe('/api/preview', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('stores the requested locale in the preview session data', async () => {
    vi.spyOn(contentService, 'getSingleContent').mockResolvedValue({} as never)

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
    vi.spyOn(contentService, 'getSingleContent').mockResolvedValue({} as never)

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
