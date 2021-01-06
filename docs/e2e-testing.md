## Overview

[Cypress](https://github.com/cypress-io/cypress) is a testing framework that provide a great experience to write end-to-end (E2E) tests for modern web applications. It's very flexible, fast, easy to use, and besides being broadly used in the javascript ecosystem, it works very well with Gatsby, that's why we choose it as our main tool. 

Feel free to check some other alternatives and compare the trade-offs of end-to-end test tools [here](https://stackshare.io/cypress/alternatives).

## Getting Started

1. Install the `cypress` and the `start-server-and-test`(permit using Gatsby’s development server with Cypress).

    ```bash 
      $ yarn add cypress start-server-and-test --dev 
    ```

2.  Add theses scripts into your `package.json`. `cy:open` will open the cypress [dashboard](https://www.cypress.io/dashboard) and `test:e2e` will run all the tests in the command line.
	
	```json
	{
	  "scripts":  {
		  "test:e2e":  "start-server-and-test develop http://localhost:8000 cy:open",
		  "cy:open":  "cypress open"
	  }
	}
	```
3. Update the `cypress.json` config file.
	
```json
	{
	  "baseUrl":  "http://localhost:8000",
	  "integrationFolder": "cypress/e2e"
	}
```
4. Run `npm run test:e2e`(it runs tests [in the command line](https://docs.cypress.io/guides/guides/command-line.html#Installation)) or `npm run cy:open`(it opens the [cypress dashboard](https://www.cypress.io/dashboard)). Both commands will generate a folder structure as below:
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

## Writing a sample test

Let's create a simple test that cover a specific product search.

1. Create a file at `cypress/e2e/search/index.js`.
2. Paste the below code.
	```bash
	describe("Search e2e tests" () => {

		beforeEach(() => {
		  cy.visit("/")
		})
		
		it("Finds a very specific product using the search bar", () => {
			cy.get("input[aria-label="Search"]").type("Eyeglasses")
			
			cy.contains('li', 'Eyeglasses').click()

			cy.contains('h1', 'Top Fashion Eyeglasses')
		})
	})

	```

## Code Coverage

To visualize the project code coverage just run `npm run coverage`... (WIP)

## Hooks

VTEX has a hub of helper functions to make writing E2E tests easy, you can install .. (WIP)

## References 

[Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)

[Cypress API](https://docs.cypress.io/api/api/table-of-contents.html)

[Cypress Examples](https://docs.cypress.io/examples/examples/recipes.html)

[VTEX Examples](https://github.com/vtex-sites/storecomponents.store)
	
[Best Practices](https://docs.cypress.io/guides/references/best-practices.html)


