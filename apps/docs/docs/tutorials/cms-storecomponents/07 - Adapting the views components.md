---
id: 7
sidebar_position: 9
sidebar_label: "7. Adapting the views components"
---

# Part 7: Adapting the `views` components

:::caution
This tutorial is intended for those who started their FastStore project with the Store Components starter. If you started your project with the Base Store starter, please refer to [this](/tutorials/cms-overview) tutorial.
:::

## Introduction

Finally, we need to update the `views` components. The `views` components bring together static data from `pages`, reusable components from `components`, and dynamic data. So, this is where we are going to tell our components which content it should render.

---

## Updating the `views` components

To update your `views` components, you must implement the logic that makes more sense for your scenario. Take the following example. 

```tsx
import type { ComponentPropsWithoutRef, FC } from 'react'
import React, { useMemo } from 'react'
import { ShelfContainer, Shelf, Container } from '@vtex/store-ui'

import Banners from '../../components/common/Banners'
import Carousel from '../../components/common/Carousel'
import Title from '../../components/product/ProductSilder/Title'
import ProductSummary from '../../components/product/ProductSummary'
import { pageSizes } from '../../components/product/ProductSilder/constants'
import type { Props } from '../../pages/index'

const useAboveTheFoldSections = (
  sections: Array<{ name: string; props: any }> | undefined
) =>
  useMemo(
    () =>
      sections?.slice(
        0,
        sections.findIndex((section) => section.name === 'Fold')
      ),
    [sections]
  )

const AboveTheFold: FC<Props> = ({ data }) => {
  const sections = useAboveTheFoldSections(data.cmsHome?.sections)

  return (
    <Container>
      {sections?.map((section, index) => {
        if (section.name === 'Carousel') {
          return (
            <Carousel
              key={`${section.name}-${index}`}
              {...(section.props as ComponentPropsWithoutRef<typeof Carousel>)}
              autoplay={5500}
              showDots
              showArrows
            />
          )
        }

        if (section.name === 'Banners') {
          return (
            <Banners
              key={`${section.name}-${index}`}
              {...(section.props as ComponentPropsWithoutRef<typeof Banners>)}
            />
          )
        }

        if (section.name === 'DynamicShelf') {
          return (
            <ShelfContainer key={`${section.name}-${index}`}>
              <Shelf
                pageSizes={pageSizes}
                showDots
                title={<Title>{section.props.title}</Title>}
                products={data.vtex.products as any}
                ProductSummary={ProductSummary as any}
              />
            </ShelfContainer>
          )
        }

        return null
      })}
    </Container>
  )
}

export default AboveTheFold
```

🎉 Congratulations! Your FastStore project is now completed integrated with the VTEX Headless CMS, and editors will now have the autonomy to create, edit, and publish web content via the VTEX Admin with the VTEX Headless CMS app.