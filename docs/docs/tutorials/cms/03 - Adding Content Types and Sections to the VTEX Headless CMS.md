---
id: 3
sidebar_label: '3. Adding Content Types and Sections to the VTEX Headless CMS'
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

# Part 3: Adding Content Types and Sections to the VTEX Headless CMS

## Introduction

Now that you have created your `cms` folder and have an overall understanding of how you'll use it, let's learn how to structure the Content Type, Section, and Translation Key files so you can create any integrations you desire. You'll also learn to use the `--watch` argument to automatically sync your changes with the VTEX Headless CMS app while developing your schemas.

---

## Step by step

### Step 1 - Automatically syncing your changes

Before we start creating more complex definitions of Content Types and Sections, go to the root of your FastStore project and run the following command to automatically sync your changes in the `cms` folder with the VTEX Headless CMS app. _Remember to use a development workspace._

```sh
vtex cms sync --watch
```

Open the **VTEX Admin** at **Pages (alpha)** and keep it next to your code to see your changes while editing the `cms` folder. Notice that refreshing the Admin may be necessary to see your changes.

### Step 2 - Adding Content Types to the VTEX Headless CMS

We already know that the `content-types.json` file is an array of JSON objects that describes the types of pages available for customization at the VTEX Headless CMS. Therefore, to create new Content Types, we just need to declare a new JSON object for each of our Content Types in the `content-types.json` file. However, we still need to discover which props these objects expect. So let's get back to our previous example.

<Tabs
defaultValue="code"
values={[
{label: 'Code', value: 'code'},
{label: 'CMS', value: 'CMS'},
]}>
<TabItem value="code">

<div>

```json title="cms/content-types.json"
[
  {
    "id": "home",
    "name": "Home Page",
    "configurationSchemaSets": []
  },
  {
    "id": "institutionalPage",
    "name": "Institutional page",
    "configurationSchemaSets": [
      {
        "name": "SEO",
        "configurations": [
          {
            "name": "siteMetadataWithSlug",
            "schema": {
              "title": "Site Metadata",
              "description": "Configure global site metadata",
              "type": "object",
              "widget": {
                "ui:ObjectFieldTemplate": "GoogleSeoPreview"
              },
              "properties": {
                "title": {
                  "title": "Default page title",
                  "description": "Display this title when no other tile is available",
                  "type": "string",
                  "default": "Store Theme | VTEX SFJ"
                },
                "description": {
                  "title": "Meta tag description",
                  "type": "string",
                  "default": "A beautifully designed site for general VTEX stores"
                },
                "titleTemplate": {
                  "title": "Title template to be used in category/product pages",
                  "type": "string",
                  "default": "%s | Store Theme"
                },
                "slug": {
                  "title": "URL Slug",
                  "type": "string",
                  "default": "/landing-page-url"
                }
              }
            }
          }
        ]
      }
    ]
  }
]
```

</div>
  </TabItem>
  <TabItem value="CMS">
  <img src="/img/tutorials/cms/contenttypes.png" width="40%" />
  </TabItem>
</Tabs>

Notice that, to declare a new Content Type, you must specify at least the following three parameters:

| Key                                      | Description                                                                                                                                                                                                                                                              |
| :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                     | The identification key of a Content Type, written in Camel Case.                                                                                                                                                                                                         |
| `name`                                   | The name presented at the VTEX Headless CMS app.                                                                                                                                                                                                                         |
| **(optional)** `configurationSchemaSets` | Creates a new tab on the page of that Content Type with advanced settings. In our example, the **Institutional Page** includes a new tab called SEO with custom SEO settings. Check the [following section](#the-configurationschemasets-property) for more information. |

#### The `configurationSchemaSets` property

Back to our example, notice that different from the Home Page, the **Institutional Page** Content Type has the `configurationSchemaSets` definition. The `configurationSchemaSets` prop creates a new tab at the VTEX Headless CMS for that Content Type with advanced settings.

For the **Institutional Page**, a custom section named SEO, which allows editors to change the site metadata, was created.

![Configuration Schema Sets](/img/tutorials/cms/cms-global-seo.png)

Also, notice that the `configurationSchemaSets` object must contain a `name`, written in **camel case**, and `configurations`. In its turn, the `configurations` object must include a `name` for identification, written in camel case, and a `schema`, written in [JSON Schema v6](http://json-schema.org/) - a description language for creating forms. The `schema` defines the structure of the form used by editors to submit data.

:::info
For more information on how to write a `schema`, check the [`JSON Schema Reference`](https://json-schema.org/understanding-json-schema/index.html).
:::

After editing the `cms/content-types.json` file, remember to save your changes and check them live by accessing the VTEX Admin at **CMS (alpha) > Pages (alpha)**. Click on **Create New** and check the available Content Type options. Click on **Institutional Page** to create a new **Institutional Page** and check the SEO tab.


<details>
<summary>Try our generic Content Type definition.
</summary>

Copy and paste the following code in the `cms/content-types.json` file to try our generic Content Type definitions. Remember to save your changes.

```json title="cms/content-types.json"
[
  {
    "id": "home",
    "name": "Home Page",
    "configurationSchemaSets": []
  },
  {
    "id": "plp",
    "name": "PLP",
    "configurationSchemaSets": [
      {
        "name": "Parameters",
        "configurations": [
          {
            "name": "Collection",
            "schema": {
              "title": "Collection",
              "description": "Definition of a Collection for the CMS",
              "oneOf": [
                {
                  "title": "Category",
                  "description": "Configure a Category",
                  "type": "object",
                  "required": ["categoryId", "sort"],
                  "properties": {
                    "categoryId": {
                      "title": "Category ID",
                      "type": "string"
                    },
                    "sort": {
                      "title": "Default ordering",
                      "type": "string",
                      "default": "\"\"",
                      "enum": [
                        "\"\"",
                        "discount:desc",
                        "release:desc",
                        "name:asc",
                        "name:desc",
                        "orders:desc",
                        "price:asc",
                        "price:desc"
                      ],
                      "enumNames": [
                        "Relevance",
                        "Discount",
                        "Release date",
                        "Name, ascending",
                        "Name, descending",
                        "Sales",
                        "Price: Low to High",
                        "Price: High to Low"
                      ]
                    }
                  }
                },
                {
                  "title": "Brand",
                  "description": "Configure a Brand",
                  "type": "object",
                  "required": ["brandId", "sort"],
                  "properties": {
                    "brandId": {
                      "title": "Brand ID",
                      "type": "string"
                    },
                    "sort": {
                      "title": "Default ordering",
                      "type": "string",
                      "default": "\"\"",
                      "enum": [
                        "\"\"",
                        "discount:desc",
                        "release:desc",
                        "name:asc",
                        "name:desc",
                        "orders:desc",
                        "price:asc",
                        "price:desc"
                      ],
                      "enumNames": [
                        "Relevance",
                        "Discount",
                        "Release date",
                        "Name, ascending",
                        "Name, descending",
                        "Sales",
                        "Price: Low to High",
                        "Price: High to Low"
                      ]
                    }
                  }
                },
                {
                  "title": "Collection",
                  "description": "Configure a Collection",
                  "type": "object",
                  "required": ["clusterId", "sort", "seo"],
                  "properties": {
                    "clusterId": {
                      "title": "Collection ID",
                      "type": "string"
                    },
                    "sort": {
                      "title": "Default ordering",
                      "type": "string",
                      "default": "\"\"",
                      "enum": [
                        "\"\"",
                        "discount:desc",
                        "release:desc",
                        "name:asc",
                        "name:desc",
                        "orders:desc",
                        "price:asc",
                        "price:desc"
                      ],
                      "enumNames": [
                        "Relevance",
                        "Discount",
                        "Release date",
                        "Name, ascending",
                        "Name, descending",
                        "Sales",
                        "Price: Low to High",
                        "Price: High to Low"
                      ]
                    },
                    "seo": {
                      "type": "object",
                      "title": "Seo",
                      "widget": {
                        "ui:ObjectFieldTemplate": "GoogleSeoPreview"
                      },
                      "required": ["title", "description", "slug"],
                      "properties": {
                        "title": {
                          "type": "string",
                          "title": "Title",
                          "description": "Appears in the browser tab and is suggested for search engines",
                          "default": "Page title"
                        },
                        "slug": {
                          "type": "string",
                          "title": "URL slug",
                          "description": "Final part of the page's address. No spaces allowed.",
                          "default": "/path/to/page",
                          "pattern": "^/([a-zA-Z0-9]|-|/|_)*"
                        },
                        "description": {
                          "type": "string",
                          "title": "Description (Meta description)",
                          "description": "Suggested for search engines",
                          "default": "Page description"
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "id": "seo",
    "name": "Global SEO Settings",
    "configurationSchemaSets": [
      {
        "name": "SEO",
        "configurations": [
          {
            "name": "siteMetadata",
            "schema": {
              "title": "Site Metadata",
              "description": "Configure global site metadata",
              "type": "object",
              "widget": {
                "ui:ObjectFieldTemplate": "GoogleSeoPreview"
              },
              "properties": {
                "title": {
                  "title": "Default page title",
                  "description": "Display this title when no other tile is available",
                  "type": "string",
                  "default": "Store Theme | VTEX SFJ"
                },
                "description": {
                  "title": "Meta tag description",
                  "type": "string",
                  "default": "A beautifully designed site for general VTEX stores"
                },
                "titleTemplate": {
                  "title": "Title template to be used in category/product pages",
                  "type": "string",
                  "default": "%s | Store Theme"
                }
              }
            }
          },
          {
            "name": "facebook",
            "schema": {
              "title": "Facebook",
              "description": "How your store is shared on Facebook",
              "type": "object",
              "required": ["thumbnail"],
              "widget": {
                "ui:ObjectFieldTemplate": "FacebookPreview"
              },
              "properties": {
                "title": {
                  "type": "string",
                  "title": "Title",
                  "description": "Store title in facebook",
                  "default": "Marin Brasil Tramontina"
                },
                "thumbnail": {
                  "type": "string",
                  "title": "Thumbnail",
                  "description": "Thumbnail to show in facebook when someone is sharing you store. The image must be bigger than 200px/200px",
                  "widget": {
                    "ui:widget": "image-uploader"
                  }
                },
                "description": {
                  "type": "string",
                  "title": "Description",
                  "description": "Site description when sharing on facebook",
                  "default": "A beautifully designed site for general VTEX stores"
                }
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "institutionalPage",
    "name": "Institutional page",
    "configurationSchemaSets": [
      {
        "name": "SEO",
        "configurations": [
          {
            "name": "siteMetadataWithSlug",
            "schema": {
              "title": "Site Metadata",
              "description": "Configure global site metadata",
              "type": "object",
              "widget": {
                "ui:ObjectFieldTemplate": "GoogleSeoPreview"
              },
              "properties": {
                "title": {
                  "title": "Default page title",
                  "description": "Display this title when no other tile is available",
                  "type": "string",
                  "default": "Store Theme | VTEX SFJ"
                },
                "description": {
                  "title": "Meta tag description",
                  "type": "string",
                  "default": "A beautifully designed site for general VTEX stores"
                },
                "titleTemplate": {
                  "title": "Title template to be used in category/product pages",
                  "type": "string",
                  "default": "%s | Store Theme"
                },
                "slug": {
                  "title": "URL Slug",
                  "type": "string",
                  "default": "/landing-page-url"
                }
              }
            }
          }
        ]
      }
    ]
  }
]
```

</details>

### Step 3: Adding Sections to the VTEX Headless CMS

Now, let's make some of our frontend components available for editing at the VTEX Headless CMS by writing the content schemas that represent them.

To define your Sections, open the `cms/sections.json` file and declare an object for each of your sections. These objects must contain a `name`, written in **camel case**, and a `schema`, written in [JSON Schema v6](http://json-schema.org/) - a description language for creating forms.

Take the following example of the Shelf component.

<Tabs
defaultValue="code"
values={[
{label: 'Code', value: 'code'},
{label: 'CMS', value: 'CMS'},
]}>
<TabItem value="code">

<div>

```json title="cms/sections.json"
[
  {
    "name": "Shelf",
    "schema": {
      "title": "Shelf",
      "description": "Displays a list of products in a carousel.",
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "title": "Shelf Title"
        },
        "searchParams": {
          "type": "object",
          "title": "Search parameters for Shelf",
          "properties": {
            "from": {
              "type": "number",
              "title": "from"
            },
            "to": {
              "type": "number",
              "title": "to"
            },
            "collection": {
              "type": "string",
              "title": "Collection"
            },
            "hideUnavailableItems": {
              "default": true,
              "type": "boolean",
              "title": "Hide unavailable items"
            }
          }
        }
      }
    }
  }
]
```

</div>

  </TabItem>
  <TabItem value="CMS">
    <img src="/img/tutorials/cms/dynamicshelfschema.png"/>
  </TabItem>
</Tabs>


#### The **`schema`** property

The `schema` will always be unique for each of your Sections as they create the form that editors will use to submit data and change the content of a given React component.

Notice that you must always declare the following properties inside the `schema` object:

| Key           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | The name that identifies your component in the VTEX Headles CMS app.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `description` | A brief description that helps editors understand the behavior of your component.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `type`        | The data type of your schema. Possible values are [`string`](https://json-schema.org/understanding-json-schema/reference/string.html), [`object`](https://json-schema.org/understanding-json-schema/reference/object.html), [`array`](https://json-schema.org/understanding-json-schema/reference/array.html), [`number`](https://json-schema.org/understanding-json-schema/reference/numeric.html#number), [`integer`](https://json-schema.org/understanding-json-schema/reference/string.html), [`boolean`](https://json-schema.org/understanding-json-schema/reference/boolean.html). |

Depending on the `type` of your schema, you may need to define particular fields related to your component structure. For example, for a schema of the `object` type, you'll need to determine `properties` that map key-value pairs. For a schema of the `array` type, you'll need to define the `items` of that array.

:::info
For more information on each property of a `schema`, check the [`JSON Schema Reference`](https://json-schema.org/understanding-json-schema/index.html).
:::

#### Using widgets

When defining your Section `schema`, you can also use the [`uiSchema`](https://react-jsonschema-form.readthedocs.io/en/docs/api-reference/uiSchema/) along with [`widgets`](https://react-jsonschema-form.readthedocs.io/en/docs/usage/widgets/) to specify which UI widget should be used to render a given field of your schema. Common widgets are `draftjs-rich-text`, `image-uploader`, and `block-select`.

Check the following example of the `draftjs-rich-text` component being used.

<Tabs
defaultValue="code"
values={[
{label: 'Code', value: 'code'},
{label: 'CMS', value: 'CMS'},
]}>
<TabItem value="code">

<div>

```json {8-24} title="cms/sections.json"
[
  {
    "name": "Shelf",
    "schema": {
      ...
    }
  },
  {
    "name": "RichText",
    "schema": {
      "title": "Rich Text",
      "description": "Displays text written in Markdown.",
      "type": "object",
      "properties": {
        "content": {
          "type": "string",
          "title": "Text",
          "widget": {
            "ui:widget": "draftjs-rich-text"
          }
        }
      }
    }
  }
]
```

</div>

  </TabItem>
  <TabItem value="CMS">
    <img src="/img/tutorials/cms/cms-widget.png"/>
  </TabItem>
</Tabs>

After editing the `cms/sections.json` file, remember to save your changes and check them live by accessing the VTEX Admin at **CMS (alpha) > Pages (alpha)**. Click on **Create New** and choose a Content Type. Then, click on the "+" icon to add a new Section and check the available options.

In our example, the **Shelf** Section would be already available for use.

![](/img/tutorials/cms/cms-new-section.png)

<details>
<summary>Try our generic Section definitions.
</summary>

Copy and paste the following code in the `cms/sections.json` file to try our generic Section definitions. Remember to save your changes.

```json title="cms/sections.json"
[
  {
    "name": "Fold",
    "schema": {
      "title": "Fold",
      "description": "Components below this will be loaded as the user scrolls",
      "type": "null"
    }
  },
  {
    "name": "Banners",
    "schema": {
      "title": "6 banners group",
      "description": "Home banners below carrousel",
      "type": "object",
      "properties": {
        "banners": {
          "type": "array",
          "maxItems": 6,
          "minItems": 6,
          "items": {
            "type": "object",
            "title": "Image",
            "properties": {
              "src": {
                "title": "Image",
                "description": "Image",
                "type": "string",
                "widget": {
                  "ui:widget": "image-uploader"
                }
              },
              "href": {
                "title": "URL address",
                "description": "",
                "type": "string"
              },
              "alt": {
                "title": "Image description",
                "description": "Image description for accessibility",
                "type": "string"
              }
            }
          }
        }
      }
    }
  },
  {
    "name": "Carousel",
    "schema": {
      "title": "Carousel",
      "description": "A carousel of images",
      "type": "object",
      "properties": {
        "allItems": {
          "type": "array",
          "minItems": 1,
          "items": {
            "title": "Images",
            "type": "object",
            "properties": {
              "sources": {
                "type": "array",
                "minItems": 2,
                "maxItems": 2,
                "items": {
                  "title": "Responsive image",
                  "type": "object",
                  "properties": {
                    "srcSet": {
                      "title": "Image",
                      "type": "string",
                      "widget": {
                        "ui:widget": "image-uploader"
                      }
                    },
                    "media": {
                      "title": "Device type",
                      "type": "string",
                      "description": "In which device the image will be shown",
                      "oneOf": [
                        {
                          "type": "string",
                          "enum": ["(max-width: 40em)"],
                          "title": "mobile"
                        },
                        {
                          "type": "string",
                          "enum": ["(min-width: 40em)"],
                          "title": "desktop"
                        }
                      ]
                    }
                  }
                },
                "required": ["media"]
              },
              "href": {
                "title": "Link",
                "description": "After clicking the image, the user will navigate to this link",
                "type": "string"
              },
              "alt": {
                "title": "Description",
                "description": "How users who cannot open the image read the link",
                "type": "string"
              }
            }
          }
        }
      }
    }
  },
  {
    "name": "RichText",
    "schema": {
      "title": "Text",
      "description": "",
      "type": "object",
      "properties": {
        "content": {
          "type": "string",
          "title": "Text",
          "widget": {
            "ui:widget": "draftjs-rich-text"
          }
        }
      }
    }
  },
  {
    "name": "SearchBanner",
    "schema": {
      "title": "Search Banner",
      "description": "Banners in PLP page",
      "type": "object",
      "required": ["desktop", "mobile", "alt"],
      "properties": {
        "title": {
          "title": "Image Title",
          "type": "string"
        },
        "description": {
          "title": "Image description",
          "type": "string"
        },
        "alt": {
          "title": "Image alt",
          "type": "string"
        },
        "desktop": {
          "title": "Desktop Banner",
          "type": "object",
          "required": ["srcSet"],
          "properties": {
            "srcSet": {
              "title": "Desktop Image",
              "type": "string",
              "widget": {
                "ui:widget": "image-uploader"
              }
            }
          }
        },
        "mobile": {
          "title": "Mobile Banner",
          "type": "object",
          "required": ["srcSet"],
          "properties": {
            "srcSet": {
              "title": "Mobile Image",
              "type": "string",
              "widget": {
                "ui:widget": "image-uploader"
              }
            }
          }
        }
      }
    }
  },
  {
    "name": "DynamicShelf",
    "schema": {
      "title": "Dynamic Shelf",
      "description": "Change your dynamic shelf",
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "title": "Shelf Title"
        },
        "searchParams": {
          "type": "object",
          "title": "Search parameters for Shelf",
          "properties": {
            "from": {
              "type": "number",
              "title": "from"
            },
            "to": {
              "type": "number",
              "title": "to"
            },
            "collection": {
              "type": "string",
              "title": "Collection"
            },
            "hideUnavailableItems": {
              "default": true,
              "type": "boolean",
              "title": "Hide unavailable items"
            },
            "orderBy": {
              "title": "Order By",
              "description": "Default search ordering",
              "type": "string",
              "default": "",
              "enum": [
                "price:desc",
                "price:asc",
                "orders:desc",
                "name:desc",
                "name:asc",
                "release:desc",
                "discount:desc",
                ""
              ],
              "enumNames": [
                "Price: High to Low",
                "Price: Low to High",
                "Sales",
                "Name, descending",
                "Name, ascending",
                "Release date",
                "Discount",
                "Default"
              ]
            }
          }
        }
      }
    }
  },
  {
    "name": "InstitutionalHeader",
    "schema": {
      "title": "Institutional page header",
      "description": "Define a title for your page",
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "title": "Institutional page title"
        }
      }
    }
  }
]
```

</details>

### Step 4 - Defining translation keys

After creating our Section schemas and Content Types, we will declare the Translation Keys in the `translation-keys.json` file. Translation Keys are used to translate the form presented for editors to any locale you'd like.

```json title="cms/translation-keys.json"
{
  "admin/siteMetadataWithSlug": "Site Metadata",
  "admin/siteMetadataWithSlugDescription": "Configure global site metadata",
  "admin/meta/siteMetadataWithSlugTitleFieldTitle": "Default page title",
  "admin/meta/siteMetadataWithSlugTitleFieldDescription": "Appears on the browser tab and is suggested to search engines",
  "admin/meta/siteMetadataWithSlugSlugFieldTitle": "URL Slug",
  "admin/meta/siteMetadataWithSlugFieldDescription": "No spaces allowed",
  "admin/meta/siteMetadataWithSlugDescriptionFieldTitle": "Meta description",
  "admin/meta/siteMetadataWithSlugDescriptionFieldDescription": "Suggested to search engines"
}
```

<details>
<summary>Try our generic Translation Key definition.
</summary>
 
Copy and paste the following code in the `cms/translation-keys.json` file to try our generic Translation Key definitions. Remember to save your changes.


```json title="cms/translation-keys.json"
{
  "admin/socialmediaTitle": "Social Media",
  "admin/meta/socialmediaTitleFieldTitle": "Title",
  "admin/meta/socialmediaTitleFieldDescription": "Appears when a link to this page is shared on social media",
  "admin/meta/socialmediaDescriptionFieldTitle": "Description",
  "admin/meta/socialmediaDescriptionFieldDescription": "Appears when a link to this page is shared on social media",
  "admin/meta/socialmediaImageFieldTitle": "Thumbnail",
  "admin/meta/socialmediaImageFieldDescription": "Appears when the page is shared on social media",
  "admin/headerTitle": "Header",
  "admin/footerTitle": "Footer",
  "admin/siteMetadataTitle": "Site Metadata",
  "admin/siteMetadataDescription": "How search engines see your store",
  "admin/meta/siteMetadataTitleFieldTitle": "Title",
  "admin/meta/siteMetadataTitleFieldDescription": "Appears on the browser tab and is suggested to search engines",
  "admin/meta/siteMetadataSlugFieldTitle": "URL Slug",
  "admin/meta/siteMetadataSlugFieldDescription": "No spaces allowed",
  "admin/meta/siteMetadataDescriptionFieldTitle": "Meta description",
  "admin/meta/siteMetadataDescriptionFieldDescription": "Suggested to search engines",
  "admin/facebookTitle": "Facebook",
  "admin/facebookDescription": "How facebook sees your store",
  "admin/meta/facebookTitleFieldTitle": "Title",
  "admin/meta/facebookTitleFieldDescription": "How the name of your site will appear in facebook",
  "admin/meta/facebookThumbnailFieldTitle": "Thumbnail path",
  "admin/meta/facebookThumbnailFieldDescription": "The path to an image of your site. This is how your site will appear on facebook",
  "admin/meta/facebookDescriptionFieldTitle": "Description",
  "admin/meta/facebookDescriptionFieldDescription": "How your site will be described in facebook"
}
```

</details>

---

## Related resources

- [JSON Schema Reference](https://json-schema.org/understanding-json-schema/index.html)
- [`react-jsonschema-form` Playground](https://rjsf-team.github.io/react-jsonschema-form/)
