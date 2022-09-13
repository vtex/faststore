---
description: Learn how to handle the impact of third-party scripts in your FastStore project.
tags: 
    - performance
    - partytown
    - third-party
    - gtm
    - google tag manager
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Handling the impact of third-party scripts

Third-party scripts often refer to elements embedded in a webpage and served by a domain different from the one being accessed. These scripts can include social sharing buttons, video player embeds, ads, analytics, and other scripts that make the web more **dynamic and interactive**.

![Third-party scripts](https://vtexhelp.vtexassets.com/assets/docs/src/thirdparty-scripts___c5428bbd435ca5aeebcaf4d28f2ad61b.png)

## Performance impact

Unfortunately, **third-party scripts tend to slow down website performance significantly.** Because they run on the main thread by default, these scripts are likely to **block the main thread**, preventing all other tasks from executing and delaying user interaction. Related issues include long execution times, slow server response, slow DNS lookup, server response errors, etc.

## Dealing with third-party scripts

Still, some third-party scripts, such as the ones responsible for injecting analytics and processing payments, might be necessary. Hence, to preserve your website performance while not ultimately resigning from the functionalities provided by third-party scripts, we suggest considering the following:

- Review your third-party scripts and only keep the ones that are actually adding value to your website.
- Self-host the script if the third-party server is slow.
- Move third-party scripts into a Web Worker, i.e., a JavaScript that runs in the background and independently of other scripts.

In the following section, you'll learn how to move your essential third-party scripts into a Web Worker using [Partytown](https://partytown.builder.io/).

*"Partytown is a lazy-loaded library to help relocate resource intensive scripts into a **web worker**, and off of the **main thread**."* Notice that Partytown is a beta project. Therefore, there are [limitations and trade-offs](https://partytown.builder.io/trade-offs), you should check before proceeding any further. 

![Partytown](https://i.imgur.com/mTkLLtf.png)

---

## Step by step

In the following step by step, you'll learn how to use Partytown and organize your third-party scripts. We will use the Google Tag Manager script as an example. 

:::caution
Notice that if you quick started your FastStore project from one of our official Starters, the Google Tag Manager script is already set up.
:::

### Step 1 - Installing Partytown
1. Open your FastStore project in any code editor of your preference.
2. Install Partytown.
    ```bash
    yarn add @builder.io/partytown
    ```
### Step 2 - Defining and exporting third-party scripts
3. Declare your key-value configurations (e.g., the GTM container ID) in the `store.config.js` file as in the following:
   ```js title="store.config.js"
   <...>
   analytics: {
      // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
      gtmContainerId: 'GTM-XXXXXX',
   },
   <...>   
   ```    
4. Create a folder named `ThirdPartyScripts` inside `src/components`. Use this folder to organize and save all third-party scripts you want to run on your website.
5. Create the `GoogleTagManager.tsx` file inside `src/components/ThirdPartyScripts` and declare the [Google Tag Manager script](https://developers.google.com/tag-manager/quickstart) as in the following:
	```tsx title="src/components/ThirdPartyScripts/GoogleTagManager.tsx"
   interface Props {
     containerId: string
     dataLayerName?: string
   }

   const GTM_DEBUG_QUERY_STRING = 'gtm_debug'

   /* Google Tag Manager script adapted to be executed only when necessary, according to https://developers.google.com/tag-manager/quickstart*/
   const useSnippet = (opts: Props & { partytownScript: boolean }) => `${ 
     opts.partytownScript ? '!' : ''
   }window.location.search.includes('${GTM_DEBUG_QUERY_STRING}=')&&
     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script',${JSON.stringify(
      opts.dataLayerName ?? 'dataLayer'
    )},${JSON.stringify(opts.containerId)});`

   function GoogleTagManager(props: Props) {
     return (
       <>
         /*Adds GoogleTagManager script to Partytown.*/
         <script
           key="gtm.partytown"
           type="text/partytown"
           dangerouslySetInnerHTML={{
             __html: useSnippet({
               ...props,
               partytownScript: true,
             }),
           }}
         />
         /*Adds GoogleTagManager script to the page, using GTM_DEBUG_QUERY_STRING for debugging reasons.*/
         <script
           key="gtm"
           type="text/javascript"
           dangerouslySetInnerHTML={{
             __html: useSnippet({
               ...props,
               partytownScript: false,
             }),
           }}
         />
       </>
     )
   }

   export default GoogleTagManager  
   ```
### Step 3 - Injecting the scripts into Partytown
6. Create the `ThirdPartyScripts.tsx` file inside `src/components/ThirdPartyScripts`. Use this file to inject your scripts into the `<Partytown/>` component.
7. Import the `<Partytown/>` component from the `@builder.io/partytown/react` submodule, your scripts (e.g., the `GoogleTagManager` script) and your configurations from `store.config.js`.
   ```tsx title="src/components/ThirdPartyScripts/ThirdPartyScripts.tsx"
   import React from 'react'
   import { Partytown } from '@builder.io/partytown/react'
   import storeConfig from '../../../store.config'
   import GoogleTagManager from './GoogleTagManager'
   ```
8. Declare all the necessary variables related to the script and handle the case of a missing configuration (e.g., no GTM container ID).
   ```tsx title="src/components/ThirdPartyScripts/ThirdPartyScripts.tsx"  
    const isString = (obj: unknown): obj is string => typeof obj === 'string'

    const gtmContainerId = storeConfig.analytics?.gtmContainerId /*The GTM Container ID specified in the store.config.js file*/

    const includeGTM = typeof gtmContainerId === 'string'  

    if (process.env.NODE_ENV === 'development' && !includeGTM) {
        console.warn(
        'No GTM container id found. Check the analytics section on your store.config.js file for enhanced observability of your store.'
        )
    }
   ```
9. Set up a function named `ThirdPartyScripts` that runs the `<Partytown/>` component and use the `forward` attribute to inject your scripts. Set up the other attributes (`debug`, `lib`, `loadScriptsOnMainThread`, and `resolveUrl`) according to your scenario. Please refer to [Partytown documentation](https://partytown.builder.io/configuration) for more information. 
	
	```tsx title="src/components/ThirdPartyScripts/ThirdPartyScripts.tsx"  
    function ThirdyPartyScripts() {
      return (
        <>
            {includeGTM && <GoogleTagManager containerId={gtmContainerId} />}
            <Partytown
                key="partytown"                
                forward={[ /* Variables to forward from main to worker. See https://partytown.builder.io/configuration for more information */
                  includeGTM && 'dataLayer.push',
                ].filter(isString)}
            />
        </>
      )
    }

    export default ThirdyPartyScripts
    ```

For additional examples, please refer to our Official Starters implementations ([Next.js](https://github.com/vtex-sites/nextjs.store/tree/main/src/components/ThirdPartyScripts)/[Gatsby](https://github.com/vtex-sites/gatsby.store/tree/main/src/components/ThirdPartyScripts)).

### Step 4 - Running the `ThirdyPartyScripts` function

10. Import and run the `ThirdyPartyScripts` function in your page's `Head` as in the following. For Next.js projects, use the `src/pages/_document.tsx` file. For Gatsby projects, use the `gatsby-ssr.tsx` file.

<Tabs groupId="chosen-framework">
  <TabItem value="nextjs" label="Next.js" default>

```diff title="src/pages/_document.tsx"
   import { Head, Html, Main, NextScript } from 'next/document'

   import WebFonts from 'src/fonts/WebFonts'
+  import ThirdPartyScripts from 'src/components/ThirdPartyScripts'
   import storeConfig from 'store.config'

   function Document() {
     return (
       <Html>
         <Head>
+          <ThirdPartyScripts />
           <WebFonts />
         </Head>
         <body className={storeConfig.theme}>
           <Main />
           <NextScript />
         </body>
       </Html>
     )
   }

export default Document
```

  </TabItem>
  <TabItem value="gatsby" label="Gatsby">

```diff title="gatsby-ssr.tsx"
	import type { GatsbySSR } from 'gatsby'

+ 	import ThirdPartyScripts from './src/components/ThirdPartyScripts'

	<...>

	export const onRenderBody: GatsbySSR['onRenderBody'] = ({
		setHeadComponents,
		setBodyAttributes,
	}) => {
+		setHeadComponents([<ThirdPartyScripts key="ThirdPartyScripts" />])
		setBodyAttributes({
			className: storeConfig.theme,
		})
	}
```

  </TabItem>
</Tabs>