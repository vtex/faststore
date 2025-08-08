export {
  default as IndexPage,
  getStaticProps as IndexgetStaticProps,
} from './pages/index'
export { default as _App } from './pages/_app'
export { default as _Document } from './pages/_document'
export {
  getStaticProps as SearchGetStaticProps,
  default as SearchPage,
} from './pages/s'
export {
  getStaticProps as CategoryGetStaticProps,
  default as CategoryPage,
  getStaticPaths as CategoryGetStaticPaths,
} from './pages/[...slug]'
// export { getStaticProps as PDPGetStaticProps, default as PDPPage } from './pages/[slug]/p'
