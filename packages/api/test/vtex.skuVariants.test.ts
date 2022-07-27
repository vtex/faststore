import {
  productGroupRootWithoutSkuProperties,
  productGroup1SkuProperty,
  productGroup2SkuProperties,
} from '../mocks/skuVariants'

import {
  createSlugsMap,
  getActiveSkuVariations,
  getFormattedVariations,
  getVariantsByName,
} from '../src/platforms/vtex/utils/skuVariants'

describe('createSlugsMap', () => {
  it('should return an empty object for a product that has no sku specification properties.', () => {
    expect(
      createSlugsMap(
        productGroupRootWithoutSkuProperties.isVariantOf.items as any,
        'Color',
        'classic-shoes'
      )
    ).toEqual({})
  })

  it('should return expected result for a product that has 1 sku specification property', () => {
    const expectedSlugsMap = {
      'Color-Red': 'classic-shoes-37',
      'Color-Green': 'classic-shoes-35',
      'Color-White': 'classic-shoes-310124175',
    }

    expect(
      createSlugsMap(
        productGroup1SkuProperty.isVariantOf.items as any,
        'Color',
        'classic-shoes'
      )
    ).toEqual(expectedSlugsMap)
  })

  it('should return expected result for a product that has multiple sku specification properties', () => {
    const expectedSlugsMap = {
      'Color-Red-Size-42': 'classic-shoes-37',
      'Color-Green-Size-40': 'classic-shoes-35',
      'Color-White-Size-42': 'classic-shoes-36',
      'Color-White-Size-41': 'classic-shoes-310124175',
    }

    expect(
      createSlugsMap(
        productGroup2SkuProperties.isVariantOf.items as any,
        'Color',
        'classic-shoes'
      )
    ).toEqual(expectedSlugsMap)
  })
})

describe('getActiveSkuVariations', () => {
  it('should return an empty object for a product that has no sku specification property', () => {
    expect(
      getActiveSkuVariations(productGroupRootWithoutSkuProperties.variations)
    ).toEqual({})
  })

  it('should return active SKU variations for a product that has 1 sku specification property', () => {
    const expected = {
      Color: 'White',
    }

    expect(getActiveSkuVariations(productGroup1SkuProperty.variations)).toEqual(
      expected
    )
  })

  it('should return active SKU variations for a product that has multiple sku specification properties', () => {
    const expected = {
      Color: 'White',
      Size: '42',
    }

    expect(
      getActiveSkuVariations(productGroup2SkuProperties.variations)
    ).toEqual(expected)
  })
})

describe('getVariantsByName', () => {
  it('should return an empty object for a product that has no sku specification property', () => {
    expect(
      getVariantsByName(productGroupRootWithoutSkuProperties.variations)
    ).toEqual({})
  })

  it('should return all SKU variations indexed by name for a product that has multiple sku specification property', () => {
    const expected = {
      Color: ['Green', 'White', 'Red'],
      Size: ['40', '42', '41'],
    }

    expect(
      getVariantsByName(
        productGroup2SkuProperties.isVariantOf.skuSpecifications
      )
    ).toEqual(expected)
  })
})

describe('getFormattedVariations', () => {
  it('should return all value options for dominantVariant and only possible combinations for others', () => {
    const expected = {
      Color: [
        {
          src: 'https://storecomponents.vtexassets.com/arquivos/ids/155559/pink-sku-variation.png?v=637087508159070000',
          alt: 'skuvariation',
          label: 'Color: Green',
          value: 'Green',
        },
        {
          src: 'https://storecomponents.vtexassets.com/arquivos/ids/155560/pink-cool-sku-variation.png?v=637063239809000000',
          alt: 'skuvariation',
          label: 'Color: Red',
          value: 'Red',
        },
        {
          src: 'https://storecomponents.vtexassets.com/arquivos/ids/155561/white-sku-variation.png?v=637087507771770000',
          alt: 'skuvariation',
          label: 'Color: White',
          value: 'White',
        },
      ],
      Size: [
        {
          src: 'https://storecomponents.vtexassets.com/arquivos/ids/155561/white-sku-variation.png?v=637087507771770000',
          alt: 'skuvariation',
          label: 'Size: 41',
          value: '41',
        },
        {
          src: 'https://storecomponents.vtexassets.com/arquivos/ids/155561/white-sku-variation.png?v=637087507771770000',
          alt: 'skuvariation',
          label: 'Size: 42',
          value: '42',
        },
      ],
    }

    expect(
      getFormattedVariations(
        productGroup2SkuProperties.isVariantOf.items as any,
        'Color',
        'White'
      )
    ).toEqual(expected)
  })
})
