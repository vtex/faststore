export {
  default as IndexPage,
  getStaticProps as IndexgetStaticProps,
} from '../src/pages/index'
export { default as _App } from '../src/pages/_app'
export { default as _Document } from '../src/pages/_document'
export {
  getStaticProps as SearchGetStaticProps,
  default as SearchPage,
} from '../src/pages/s'
export {
  getStaticProps as CategoryGetStaticProps,
  default as CategoryPage,
  getStaticPaths as CategoryGetStaticPaths,
} from '../src/pages/[...slug]'
export { getStaticProps as PDPGetStaticProps, getStaticPaths as PDPGetStaticPaths, default as PDPPage } from '../src/pages/[slug]/p'
