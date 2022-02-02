---
sidebar_position: 2
---

# Integrating the VTEX Login

In this guide, you'll learn how to integrate the **VTEX Login** with your **FastStore** project.

The VTEX Login is provided by the `vtexcommercestable` environment and uses a subdomain. Therefore, to successfully integrate the VTEX Login with your FastStore project, you must add a redirect back to the FastStore environment and set up the necessary auth cookies to authenticate client requests and maintain session information. This way, once shoppers finish logging in to your store, they can be redirected back to your website's main domain.

---

## Before you start

Before proceeding any further, make sure you are already [hosting your FastStore + VTEX website on the internet](/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website).

---

## Step by step

### Step 1 - Adding a redirect back to your FastStore domain

By the end of this step, changes will be live to all end-users, meaning that once shoppers finish logging in to your store, they will be redirected back to your website's main domain.

1. Access the VTEX Admin.
2. Go to **Store Setup > CMS > Layout**.
3. In the left-side navigation menu, click on **CMS**.
4. Click on **HTML Templates** and open the **Home** file.
5. Add the following script to the Home's `<head>`.
   - *Replace the value between curly brackets with your store domain.*
   
   ```xhtml
   <meta http-equiv="refresh" content="0; URL='https://{maindomain}'"/>
   ```

6. Clean the `<body>` section to remove unnecessary code. By the end of this step, your Home file should look like the following:

  ![Home Template](/img/how-to-guides/home-template.png)

7. Click on the **Save Template** button.

## Step 2 - Setting the auth cookie root domain 

To authenticate client requests and maintain session information, you must ensure that the auth cookies are set up for the **Login** subdomain. To do that, [open a support ticket](https://help-tickets.vtex.com/smartlink/sso/login/zendesk) to the Identity team requesting to set up the auth cookie root domain for your FastStore URL.
