import { optimize } from './fileManager'
describe('Image Optimization', () => {
test('return URL with the correct parameters', () => {
  const imageSrc =
    'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/f05e3621-d515-4dac-8c44-675f1ab36b66___3be6fb3cbcef0db2be3ad13631f2f356.jpg'

  // Generate random values for parameters
  const height = Math.floor(Math.random() * 1920) + 480
  const width = Math.floor(Math.random() * 1920) + 480
  const ratio = Math.floor(Math.random() * 5) + 1
  const aspect = Math.random() < 0.5

  // Run optimize API
  const optimized = optimize(imageSrc, { width, height, aspect }, { ratio })

  // Get optimized URL
  const urlParams = new URL(optimized)

  // Get parameters from URL
  const heightFromURL = urlParams.searchParams.get('height')
  const widthFromURL = urlParams.searchParams.get('width')
  const aspectFromURL = urlParams.searchParams.get('aspect')

  expect(heightFromURL).toBe(`${height * ratio}`)
  expect(widthFromURL).toBe(`${width * ratio}`)
  expect(aspectFromURL).toBe(`${aspect}`)
})
