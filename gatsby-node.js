const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  // Map Crystallize shape names to the page templates
  const templates = {
    Article: path.resolve(`src/page-templates/article.js`),
    Product: path.resolve(`src/page-templates/product/index.js`),
    Folder: path.resolve(`src/page-templates/folder.js`),
  }

  /**
   * Get items 5 levels deep from Crystallize.
   * You can get even more levels by quering more children:
   * children {
   *   path
   *   shape {
   *     name
   *   }
   * }
   */
  return graphql(
    `
      query loadAllCrystallizeCatalogueItems {
        crystallize {
          catalogue(language: "en", path: "/") {
            children {
              path
              shape {
                name
              }
              children {
                path
                shape {
                  name
                }
                children {
                  path
                  shape {
                    name
                  }
                  children {
                    path
                    shape {
                      name
                    }
                    children {
                      path
                      shape {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Reduce all items into a single flat array
    const items = []
    {
      ;(function add({ path, shape, children }) {
        if (path && shape) {
          // Ensure that we have a template for this shape
          if (shape.name in templates) {
            items.push({ path, shape, component: templates[shape.name] })
          } else {
            items.push({ path, shape, component: templates.Folder })
            console.log(
              `No template was found for shape "${shape.name}". "${path}" is rendered using the Folder template`
            )
          }
        }
        if (children) {
          children.forEach(add)
        }
      })(result.data.crystallize.catalogue)
    }

    // Create pages for each node
    items.forEach(({ path, component }) => {
      createPage({
        path,
        component,
        context: {
          // Add optional context data to be inserted
          // as props into the page component..
          //
          // The context data can also be used as
          // arguments to the page GraphQL query.
          //
          // The page "path" is always available as a GraphQL
          // argument.
        },
      })
    })
  })
}
