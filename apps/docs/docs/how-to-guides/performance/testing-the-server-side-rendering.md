---
tags: 
    - performance
---

# Testing the server-side rendering

JavaScript handles data fetching, templating, and routing on the client-side rather than on the server-side. Nevertheless, the amount of JavaScript shipped to the browser tends to increase as the complexity of an application grows. As a result, JavaScript code competes for processing power and delays the rendering task while striving to be processed before the browser finishes rendering the page content.

Because of that, you should always check how your web page looks and behaves when JavaScript is disabled. Performing this test will help you guarantee your server-side rendering (SSR) HTML is functional and free of bugs.

## Step by step

1. Check the documentation of your web browser and search how to disable JavaScript.

    - If you are using Google Chrome, check Google's documentation on [Disabling JavaScript.](https://developers.google.com/web/tools/chrome-devtools/javascript/disable)

2. Access your website and observe if its core functionalities are working as expected. Your store won't function the same way as planned. However, the following behaviors will help you identify expected and undesired behaviors:

    - **Undesired behaviors**

        - The page does not render anything.
        - Instead of updating only the different content, the page is fully refreshed when navigating to another page.
        - Misplaced layout.

    - **Expected behaviors**

        - Simpler design.
        - Animations and interactive menus do not work.
        - The below-the-fold content does not render.