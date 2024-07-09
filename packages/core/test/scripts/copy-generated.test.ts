import { copyGenerated } from '../../scripts/copy-generated.js'
import { ensureDirSync, rmdirSync } from 'fs-extra'
import path from 'path'

describe('Copy Generated', () => {
  const outputPath = path.resolve(__dirname, '../__mocks__/output')
  it('copies all files in the `from` directory', () => {
    const { success } = copyGenerated(
      path.resolve(__dirname, '../__mocks__/@generated'),
      outputPath
    )

    expect(success).toBe(true)
  })

  it('returns success: false if the from dir does not exist', () => {
    const { success } = copyGenerated(
      path.resolve(__dirname, '../__mocks__/non-existent-@generated'),
      outputPath
    )

    expect(success).toBe(false)
  })

  afterEach(() => {
    ensureDirSync(outputPath)
    rmdirSync(outputPath, { recursive: true })
  })
})
