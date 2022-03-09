---
title: November, 2021
description: FastStore Release Notes 
tags: [faststore]
hide_table_of_contents: false
---

New Accordion, Breadcrumb, and Table components now available in the FastStore UI. We've also updated the Lighthouse CI to support Google Lighthouse v8.

<!--truncate-->

##  Features 🚀

- **New component: Accordion molecule** [(#985)](https://github.com/vtex/faststore/pull/985)
We have added the [Accordion component](https://faststoreui.netlify.app/?path=/docs/molecules-accordion--multiple-and-collapsible) to the FastStore UI. The Accordion component hides its content by default.

![accordion](https://user-images.githubusercontent.com/67270558/139713271-b44c5724-c65e-4030-b660-a172410b6034.gif)

 
- **New component: Breadcrumb molecule** [(#986)](https://github.com/vtex/faststore/pull/986)
We have added the [Breadcrumb Molecule](https://faststoreui.netlify.app/?path=/docs/molecules-breadcrumb--breadcrumb) to the FastStore UI. Use it to create secondary navigation and help users identify their location in the store.

![breadcrumb](https://user-images.githubusercontent.com/67270558/139714982-2400c384-e4b6-414b-b401-686830b85589.png)

- **New component: Table molecule** [(#987)](https://github.com/vtex/faststore/pull/987)
We have added the [Table molecule](https://faststoreui.netlify.app/?path=/docs/molecules-table--table) to the FastStore UI.

![table](https://user-images.githubusercontent.com/67270558/140552170-56f8460e-1023-49c0-b05e-f8a500390757.png)

## Bug fixes 🐛

- **Browser support** [(#984)](https://github.com/vtex/faststore/pull/984)
FastStore 0.x now supports  older browsers versions.

-  **Search Input Accessibility issues** [(#1000)](https://github.com/vtex/faststore/pull/1000)
We have added `aria-labels` to the input field and button of the [Search Input component](https://faststoreui.netlify.app/?path=/docs/molecules-searchinput--default) to solve [accessibility issues](https://www.a11yproject.com/checklist/).


## Improvements ✔️

-  **Add a11y tests for all atoms** [(#988)](https://github.com/vtex/faststore/pull/988)
We have added accessibility tests for atoms of [FastStore UI](https://faststoreui.netlify.app/?path=/story/getting-started-welcome--welcome)

- **Add a11y tests for all molecules** [(#992)](https://github.com/vtex/faststore/pull/992)
We have added accessibility tests for molecules of [FastStore UI](https://faststoreui.netlify.app/?path=/story/getting-started-welcome--welcome).

 **Accordion doc** [(#994)](https://github.com/vtex/faststore/pull/994)
We have improved the Storybook doc to show more information about the components that compose the [Accordion](https://faststoreui.netlify.app/?path=/docs/molecules-accordion--multiple-and-collapsible).


## Breaking Changes 💥

- **Lighthouse CI updated: Changes on performance score and Lighthouse report**
We have updated the Lighthouse CI to the [version 8 of Google Lighthouse](https://www.debugbear.com/blog/lighthouse-v8) that can reflect on score variations in Lighthouse CI of Pull Requests. 

From now on, the overall score of **`Cumulative Shift Layout` and `Total Blocking Time` have increased in importance**, and the **deprioritized** metrics are **`First Contentful Paint`, `Speed Index`, and `Time to Interactive`.**
