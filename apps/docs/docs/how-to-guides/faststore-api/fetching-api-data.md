# Fetching API data

You can build and customize GraphQL queries to display ecommerce data on your storefront, such as products and shopping cart information. In this guide, you will find the basic concepts and steps to implement this in your FastStore project.

## Before coding

Before getting to work on your code, there are some concepts you should be familiar with when it comes to the FastStore API.

The FastStore API extends the data layer of your preferred static site generation framework (e.g., Gatsby, Next.js) including data from an ecommerce platform. Because of that, ecommerce information is queried when pages are built.

This means that updating a given product's information on your ecommerce platform does not automatically updates the information displayed on a previously built product page. Whenever you wish to update the information displayed on your website according to your ecommerce platform data, you should redeploy your website, which will trigger page re-generation.



