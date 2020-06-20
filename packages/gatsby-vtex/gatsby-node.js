'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.onCreateWebpackConfig = exports.onCreatePage = exports.createPages = void 0
const path_1 = __importDefault(require('path'))
exports.createPages = ({ actions: { createPage }, graphql }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield graphql(`
      query {
        allProduct {
          nodes {
            id
            slug
          }
        }
      }
    `)
    data.allProduct.nodes.forEach((product) => {
      createPage({
        path: product.slug,
        component: path_1.default.resolve(`./src/templates/product.tsx`),
        context: {
          id: product.id,
        },
      })
    })
  })
exports.onCreatePage = ({ page, actions }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { createPage } = actions
    if (page.path !== '/') {
      return
    }
    page.matchPath = '/*'
    createPage(page)
  })
exports.onCreateWebpackConfig = ({ actions: { setWebpackConfig } }) => {
  setWebpackConfig({
    resolve: {
      alias: {
        react: require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        '@loadable/component': require.resolve('@loadable/component'),
        '@loadable/server': require.resolve('@loadable/server'),
      },
    },
  })
}
