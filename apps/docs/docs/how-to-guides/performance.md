---
tags: 
    - performance
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

# Performance 

*This section presents a few practices you can employ to monitor and improve your store's website performance while aiming for **high scores in [Lighthouse](https://developers.google.com/web/tools/lighthouse) audits**.*

---

In the ecommerce business, the performance of your website has a direct impact on shoppers' experience. It may affect **sales conversion rate**, **user session time**, and other relevant metrics. Every millisecond counts and affects not only the shopper's decision-making process but also your store's website **rank in search engine results**. That's why you must always ensure that your website is as fast and performant as possible.

## Performance slowdowns

As the complexity of your project increases, many factors may slow down your website performance. That's why maintaining a website's performance is a **continuous effort**, which requires some commitments. 

Some points of attention are:

- **Third-party scripts:** Third-party scripts are one of the leading causes of performance slowdowns. These scripts fire additional network requests to multiple servers and are likely to block DOM construction, keeping the main thread busy and delaying how quickly pages can render. 

- **Page weight:** Page weight comprises the total size of a web page, including all the resources needed for a page to load (i.e., images, stylesheets, and other static files). The heavier the files and data your website sends to the client, the longer the browser takes to render your page. Generally, *"80–90% is spent downloading all the components in the page."* ([Steve Souders](https://www.oreilly.com/library/view/high-performance-web/9780596529307/)) Hence, reducing page weight is a great opportunity for improving your website performance.
  
  Page weight issues are related mainly to:
  - Uncompressed files.
  - Unoptimized images.
  - Unoptimized fonts.
  - Unclean code.

- **HTTP requests:** When a user visits a web page, the browser sends multiple HTTP requests to load all the resources (i.e., images, stylesheets, fonts, etc.) needed to render that web page. Downloading these resources, however, significantly impacts the page's loading time. Therefore, besides optimizing images, compressing files, and reducing download size, it's also important to consider minimizing download frequency.

- **Render-blocking resources:** Render-blocking resources are scripts, stylesheets, and code files sequentially downloaded, parsed, and executed by the browser. Hence, when the browser faces a render-blocking resource, it stops the entire rendering process until these critical files are processed first. Although these resources take a considerable time for the browser to process, they may not be crucial for the user experience.
  
> *To handle these issues, please refer to Best practices for performance (Coming Soon).*

## Monitoring tools

There are several tools available for identifying performance issues and helping improve website performance, such as:

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)/[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/): an open-source automated tool created by Google used to identify common problems related to the quality of a webpage through audits.
- [SpeedCurve](https://speedcurve.com/): live dashboards that monitor web applications' experience across different browsers and platforms and provide visibility over performance.
- [PartyTown](https://partytown.builder.io/): a lazy-loaded library to help relocate resource-intensive scripts into a web worker and off of the main thread.
- [Google DevTools](https://developer.chrome.com/docs/devtools/):  a set of web developer tools built directly into the Google Chrome browser.

## Main guides

<DocCardList items={useCurrentSidebarCategory().items}/>
