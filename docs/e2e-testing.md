# Building end-to-end tests

End-to-end (E2E) testing replicates real user scenarios to ensure the application flow performs as expected from beginning to end. It can be used to verify different user behaviors, such as requesting a webpage or logging in. This way, E2E testing also endorses integration with other subsystems and data integrity.

In the Store Framework Jamstack (SFJ), end-to-end tests are developed with Cypress.

> ℹ️ [Cypress](https://www.cypress.io/) is a JavaScript-based end-to-end testing framework, widely used together with Gatsby, that serves as a tool to validate client-side code running in the browser.

In the following section, you'll learn how to build your own E2E test with Cypress. Therefore, if you're not familiar with Cypress, we strongly encourage you to check [Cypress's documentation](https://docs.cypress.io/guides/overview/why-cypress.html) before proceeding any further.

## Step by step
 
### Step 1: Setting up your development environment

1. Open up the terminal.
2. Install the `cypress` and the `start-server-and-test` packages to your `devDependencies`:

   ```bash
     $ yarn add cypress start-server-and-test --dev
   ```

3. Add these scripts into your `package.json`.

   ```json
   {
     "scripts": {
       "test:e2e": "start-server-and-test develop http://localhost:8000 cy:open",
       "cy:open": "cypress open"
     }
   }
   ```

> ℹ️  The `cy:open` script opens the [Cypress dashboard](https://www.cypress.io/dashboard) and the `test:e2e` script runs all tests specified in that project in the command line.

4. Go to the root directory of your project and update the `cypress.json` config file with the following code:

```json
{
  "baseUrl": "http://localhost:8000",
  "integrationFolder": "cypress/e2e"
}
```

5. Now, run `npm run test:e2e` to [run tests in the command line](https://docs.cypress.io/guides/guides/command-line.html#Installation) or `npm run cy:open` to open the [Cypress dashboard](https://www.cypress.io/dashboard). Whatever option you choose will generate a folder structure as below:

   ```bash
   ├── cypress
   │   ├── fixtures
   │   	├── example.json
   │	├── integration
   │   	├── examples
   │   		├── ...
   │   ├── support
   │   ├── plugins
   ```

Now you're ready to start developing your own E2E tests! Additionally, you can install the [VTEX helper functions hub](https://github.com/vtex/test-tools) to make writing E2E tests easier.

### Step 2: Writing a sample test

In the following, we'll create a simple test that verifies how a specific product search behaves. Use it as an example to create your own E2E test with Cypress.

1. Open up your SFJ project in the code editor of your choosing.
2. Create a new file named `index.js` inside `cypress/e2e/{test-name}` (e.g., `cypress/e2e/search`).
3. Make sure to add the `data-testid` attribute to the elements that will need some interaction. In our case are `searchBarInput`, `searchBarItem`, and `productTitle`.
4. Using JavaScript or Typescript, write your E2E test. Take the code below as an example:

   ```js
   describe("Search e2e tests" () => {

   	it("Finds a very specific product using the search bar", () => {

           cy.visit("/")

   		cy.get('[data-testid="searchBarInput"]').type("{{ PRODUCT_NAME }}")


   		cy.get('[data-testid="searchSuggestionItem"]').contains("{{ PRODUCT_NAME }}").click()

   		cy.get('[data-testid="productTitle"]').should('has.text', "{{ PRODUCT_NAME }}")
   	})
   })
   ```

> ℹ️  This test checks how our SFJ store behaves when it receives a product name of your store as an input in our search bar.

> ℹ️  To build your own tests, we strongly encourage you to check Cypress's [guides](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file), [examples](https://docs.cypress.io/examples/examples/recipes.html#Fundamentals), [API reference](https://docs.cypress.io/api/api/table-of-contents.html), and [best practices](https://docs.cypress.io/guides/references/best-practices.html).

5. Run `npm run test:e2e` to check the status of the tests.

That's it! Additionally, you can add a code coverage tool to monitor the status of your tests and find new opportunities. You can check Cypress's Code Coverage [documentation](https://docs.cypress.io/guides/tooling/code-coverage.html#Introduction).
