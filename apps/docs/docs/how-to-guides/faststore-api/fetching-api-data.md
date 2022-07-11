# Fetching API data

You can build and customize GraphQL queries to display ecommerce data on your storefront, such as products and shopping cart information. In this guide, you will find the basic concepts and steps to implement this in your FastStore project.

## Before you start

Before getting to work on your code, there are some concepts you should be familiar with when it comes to the FastStore API.

The FastStore API extends the data layer of your preferred static site generation framework (e.g., Gatsby, Next.js) including data from an ecommerce platform. Because of that, ecommerce information is queried for a given page only when that page is built.

This means that updating a given product's information on your ecommerce platform does not automatically update the information displayed on a previously built product page. Whenever you wish to update the information displayed on your website according to your ecommerce platform data, you should redeploy your website, which will trigger page re-generation.

We also recommend that you take the time to learn more about data fetching in the context of the framework you are using, by checking the corresponding article:
- [Next.js Data fetching overview](https://nextjs.org/docs/basic-features/data-fetching/overview)
- [Querying data in pages with Gatsby](https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/)

## Fetching ecommerce data

There are three main steps to building your page code to fetch data from the FastStore API:

1. [Building a query](#building-a-query).
2. [Importing the generated query](#importing-the-generated-query).
3. [Using the data](#Using-the-data).

Below you can see more details about each step along with code examples.

### 1. Building a query

First, you need to know what API data you want to use on your page and how to structure a GraphQL query to get it. It is a good idea to check the FastStore API reference on [queries](https://www.faststore.dev/how-to-guides/faststore-api/using-graphiql-to-explore-the-faststore-api). You can also [use GraphiQL to build and test queries](https://www.faststore.dev/how-to-guides/faststore-api/using-graphiql-to-explore-the-faststore-api) to make sure it works as expected.

Once you have your query structure, you can pass that on to your code by using the `gql` tag, like in the following example.

### 2. Importing the generated query



### 3. Using the data




