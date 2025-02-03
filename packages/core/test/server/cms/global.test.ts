import type { GlobalSectionsData } from '../../../src/components/cms/GlobalSections'
import { injectGlobalSections } from '../../../src/server/cms/global'

describe('hCMS - Multiple Global Section content type injectGlobalSections', () => {
  describe('injectGlobalSections', () => {
    it('should inject globalSectionsHeader before Children and globalSectionsFooter after', () => {
      const globalSections: GlobalSectionsData = {
        sections: [
          { name: 'Navbar', data: {} },
          { name: 'Children', data: {} },
          { name: 'Footer', data: {} },
        ],
      }

      const globalSectionsHeader: GlobalSectionsData = {
        sections: [{ name: 'ExtraHeader', data: {} }],
      }

      const globalSectionsFooter: GlobalSectionsData = {
        sections: [{ name: 'ExtraFooter', data: {} }],
      }

      const result = injectGlobalSections({
        globalSections,
        globalSectionsHeader,
        globalSectionsFooter,
      })

      expect(result.sections).toEqual([
        { name: 'Navbar', data: {} }, // Before Children
        { name: 'ExtraHeader', data: {} }, // Injected header before Children
        { name: 'Children', data: {} }, // Children
        { name: 'ExtraFooter', data: {} }, // Injected footer after Children
        { name: 'Footer', data: {} }, // Remaining sections
      ])
    })

    it('should maintain order if globalSectionsHeader or globalSectionsFooter are empty', () => {
      const globalSections: GlobalSectionsData = {
        sections: [
          { name: 'Navbar', data: {} },
          { name: 'Children', data: {} },
          { name: 'Footer', data: {} },
        ],
      }

      const globalSectionsHeader: GlobalSectionsData = {
        ...globalSections,
        sections: [],
      }
      const globalSectionsFooter: GlobalSectionsData = {
        ...globalSections,
        sections: [],
      }

      const result = injectGlobalSections({
        globalSections,
        globalSectionsHeader,
        globalSectionsFooter,
      })

      expect(result.sections).toEqual(globalSections.sections)
    })

    it('should throw an error when the "Children" section is missing', () => {
      const globalSections: GlobalSectionsData = {
        sections: [
          { name: 'Navbar', data: {} },
          { name: 'Footer', data: {} },
        ],
      }

      expect(() =>
        injectGlobalSections({
          globalSections,
          globalSectionsHeader: {
            sections: [],
          },
          globalSectionsFooter: {
            sections: [],
          },
        })
      ).toThrow(Error)
    })
  })
})
