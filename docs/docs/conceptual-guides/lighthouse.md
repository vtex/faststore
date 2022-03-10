# Lighthouse

<img align="right" src="https://user-images.githubusercontent.com/60782333/100936269-02d09c80-34d0-11eb-9990-c0b7b910f60e.png"/>

[Lighthouse](https://developers.google.com/web/tools/lighthouse) is an open-source, automated tool created by Google, capable of identifying common problems related to the quality of a webpage through audits.

In this article, we'll focus on the Lighthouse Performance audit capacity. However, it might be valuable to know Lighthouse has audits for:

- [**Performance**](#performance-audits) - Provides helpful information on how the user perceives the page performance.

  :::info
  The [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) performance report is powered by [Lighthouse](https://developers.google.com/web/tools/lighthouse). You simply provide the page URL and PageSpeed Insights returns powerful insights and a full analysis that help you improve page performance.
  :::

- [**Progressive web apps**](https://web.dev/lighthouse-pwa/) - Provides suggestions on how to build a PWA with a full application-like experience.
- [**Best practices**](https://web.dev/lighthouse-best-practices/) - Provides pieces of advice  on how to improve the overall code health of webpages and keep up with the best practices for modern web development.
- [**Accessibility**](https://web.dev/lighthouse-accessibility/) - Provides helpful insights on how to improve the page usability for people with disabilities or impairments.
- [**SEO**](https://web.dev/lighthouse-seo/) - Checks if the page is optimized for search engine results ranking.

## Performance audits

The Lighthouse performance report is composed of:

1. The overall **Performance score** - A value between 0 and 100 representative of users' perception of performance, calculated according to a series of metrics collected and analyzed in a controlled environment.
2. **[Performance metrics](#performance-metrics)** - The results of independent and quantitative metrics collected *in the field* (historical data from real-users) and *in the lab* (data from simulations performed in a controlled environment).
3. **Origin Summary** - The comparison of the page's *in the field* metric results to all pages served from the same domain.
4. **Opportunities** - Insights on how to improve the page load time with evaluations on how fast the page load would improve with the suggested measures.
5. **Diagnostics** - Additional insights on how to keep the page up to date with the best practices for web development.
6. **Passed audits** - *Opportunities* and *Diagnostics* suggestions that have already been implemented on the page.

:::info
[Web.dev Measure](https://web.dev/measure/) provides results for **mobile only**. We suggest **testing on [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) instead**, which displays results for both desktop and mobile devices.
:::

*Opportunities* and *Diagnostics* have an indirect relationship with the overall *Performance score*. However, differently from *Lab* data metrics, they do not directly impact *Lighthouse Performance score*. In light of that, in this guide, we'll focus on getting to know *Performance metrics*.

## Performance metrics

Web performance is a relative term. From the user's point of view, it's a perception of how he experiences page loading and how responsive a page feels. 

Even if, for a computer, performance could be better described as the time it takes for the whole page to load, this specific metric may not necessarily correspond to anything the user cares about.

However, as a subjective concept, it's not possible to measure the overall web performance with one single metric.

In this sense, page loading can be understood as a progressive journey with four key moments:

1. **Is it happening?** The first critical moment in which the first visual activity occurs and the user notices the page is loading. If the server doesn't respond quickly, the user may feel that there’s a problem and leave the page.
2. **Is it useful?** The moment in which there's enough valuable content rendered, capable of keeping the user engaged and improving his experience.
3. **Is it usable?** The moment in which the UI seems ready for interaction. This moment can be frustrating if the users try to interact with visible content, but the page is busy.
4. **Is it delightful?** The moment after loading in which the page guarantees a smooth, free of-lag user-experience.

Considering these four moments during the page load journey, a series of individual metrics were created considering what might be relevant for users in each one of these moments.

![page journey](https://user-images.githubusercontent.com/60782333/100931294-162c3980-34c9-11eb-8e83-e4c2976eec23.png)

Before diving deeper into performance metrics, it's important to differentiate *Lab* and *Field* Data, two types of metric data that Lighthouse provides.

*Lab* data presents the results of the metrics obtained using tools that simulate the page load in a consistent, controlled environment.

Testing *in the lab* says a lot about performance. However, it doesn't necessarily reflect how users experience it. Here, it's important to remember that performance is relative and can vary dramatically depending on the user's device and network conditions.

In this sense, *Field* data presents a historical report about how the page has performed, considering anonymized performance data from real users on a variety of devices and network conditions.

:::info
Not necessarily *Field* or *Lab* data will be better or worse than the other. We recommend that you monitor and use both to ensure the best performance possible.
:::

In light of that, the **Performance score** provides an estimated representation of user's perception of performance by computing a *weighted average* of the following **six in the lab metrics**:

<p align="center">
<img height="353" width="665" src="https://user-images.githubusercontent.com/60782333/100743375-f9a1db80-33ba-11eb-8a11-cd58a8f7da76.png"/>
</p>

:::info
Notice that [Largest Contentful Paint](#largest-contentful-paint-lcp--25) and [Total Blocking Time](#total-blocking-time-tbt--25) are more heavily weighted. Consequently, they have a bigger impact on the overall Performance score than the other metrics. Paying close attention to these two measurements is paramount.
:::

Each of these metrics is briefly explained in the following sections.

:::info
The way Lighthouse calculates scores changed on **May 19th, 2020**, with the release of **Lighthouse 6.0**. Sudden changes in scores around that date are likely a reflection of that update.
:::

When running Lighthouse, you may also notice that the metrics results obey a color code according to the following ranges:

<p align="center">
<img height="300" width="503" src="https://user-images.githubusercontent.com/60782333/100747617-0e816d80-33c1-11eb-8221-14e35e6fa98c.png"/>
</p>

:::info
When tracking improvements and regressions, we recommend **focusing on improving individual metrics rather than on the total score.**
:::

### [First Contentful Paint (FCP)](https://web.dev/first-contentful-paint/) | 15%

*First Contentful Paint* measures the time it takes for the browser to render the first bit of DOM contents of the page.

From the user's point of view, a short FCP time means a fast visual activity from the browser. That also means that short FCP times are more likely to keep users engaged.

Check in the following how Lighthouse classifies FCP times:

|FCP time (seconds)|Color-coding|
|--|--|
|Over 4|Red (poor)|
|2-4|Orange (needs improvement)|
|0-2|Green (good)|

>⚠️ FCP time affects most of the other metrics and serves as a huge red flag if it's taking too long.

Notice that this metric can be affected by:

- the time it takes for the server to respond.
- the time it takes for the browser to load and display the HTML.
- the presence of CSS and JS files on the page's `<head>`.
- the time it takes to load fonts - in case they delay text rendering.

Also, keep in mind that **server rendering usually delivers a fast FCP**. Thus, in cases Server Side Rendering is not correctly working or if it's absent, the FCP time can be hugely impacted.

### [Speed Index (SI)](https://web.dev/speed-index/) | 15%

*Speed Index* measures the average time it takes for the above-the-fold content of the page to be visually available.

By considering only the page's above-the-fold content, *Speed Index* focuses on what the user sees and not necessarily on what the browser loads. Thus, it is an important metric for revealing user experience.

Also, notice that this metric is dependant on the viewport size, a variable parameter. As a consequence, the same page can perform differently depending on the screen resolution used. Hence, when measuring your page’s *Speed Index*, you must take into account the viewport sizes that are mostly used by your visitors.

With that in mind, check how Lighthouse classifies SI times:

|SI time (seconds)|Color-coding|
|--|--|
|0ver 5.8|Red (poor)|
|4.4-5.8|Orange (needs improvement)|
|0-4.3|Green (good)|

:::info
Do not confuse SI with FCP. Notice that SI measures how quickly most of the content is displayed, whereas FCP measures how long it takes for the very first piece of content to be visible.
:::

Notice that this metric can be affected by:

- the *First Contentful Paint (FCP)*.
- image size, fonts, etc.
- client-side rendering via JS.

### [Largest Contentful Paint (LCP)](https://web.dev/lcp/) | 25% 

*Largest Contentful Paint* measures the time it takes to render the largest visible element of the page within the viewport.

![FCP](https://user-images.githubusercontent.com/60782333/100933448-209c0280-34cc-11eb-8cb1-74857834f92d.png)

In practice, a fast LCP time helps reassure the user that the page is useful.

|LCP time (seconds)|Color-coding|
|--|--|
|Over 4|Red (poor)|
|2.5-4|Orange (needs improvement)|
|0-2.5|Green (good)|

LCP is mostly affected by image size and the time taken to load that content.

:::info
Given [the types of elements considered for LCP](https://web.dev/lcp/#what-elements-are-considered), it's usually possible for this metric to track the time it takes to display large banners and carousels.
:::

Lazy loading content below-the-fold is a good practice for improving LCP. That's because lazy loading focuses network bandwidth on the content above-the-fold and guarantees that no large stray elements interfere with LCP performance.

### [Time to Interactive (TTI)](https://web.dev/interactive/) | 15%

*Time to Interactive* measures the time it takes for the page to become interactive and capable of responding to user inputs.

Check in the following how Lighthouse classifies TTI times:

|TTI time (seconds)|Color-coding|
|--|--|
|Over 7.3|Red (poor)|
|3.9-7.3|Orange (needs improvement)|
|0-3.8|Green (good)|

Notice that this metric can be affected by:

- the time the page takes to display useful content (*FCP*).
- JS load, parse, and execution time.

TTI might also be affected by large images and CSS since loading these files can delay the load time of JS scripts.

### [Total Blocking Time (TBT)](https://web.dev/lighthouse-total-blocking-time/) | 25% 

The *Total Blocking Time* metric measures the amount of time during page-load in which user inputs, such as mouse clicks, screen taps, or keyboard presses, are blocked.

That happens when there's a **long task** that blocks the main thread, impeding the browser to respond to other requests until that long task is finally processed.

:::info
A long task is a task that has an execution time greater than 50 ms. Long tasks have a blocking time, which starts to be counted after 50ms. For example, if a function takes 150ms to execute, the blocking time is 100ms.
:::

The *Total Blocking Time* of a page is the sum of the blocking time of each long task that occurs between *First Contentful Paint* (FCP) and *Time to Interactive* (TTI).

Check in the following how Lighthouse classifies TBT times:

|TBT time (milliseconds)|Color-coding|
|--|--|
|Over 600|Red (poor)|
|300 - 600|Orange (needs improvement)|
|0 - 300|Green (good)|

In practice, if the page presents a large TBT, the visitor may notice the delay and perceive the page as sluggish.

TBT is mostly affected by JS parsing and execution.

Besides removing or reducing JS codes, it's possible to improve TBT by splitting long tasks into smaller ones, improving code efficiency, and implementing lazy load.

### [Cumulative Layout Shift (CLS)](https://web.dev/cls/) | 5% 

:::caution
The weight of CLS on the Performance score may increase in the future.
:::

The *Cumulative Layout Shift* metric measures the impact of undesired content shifts that occur during the entire lifespan of a page.

A layout shift occurs when a visible element changes its initial position from one rendered frame to the next.

:::info
Rendering new elements or resizing existing ones will cause layout shift only if it makes another visible component changes its start position.
:::

![CLS](https://user-images.githubusercontent.com/60782333/100920056-60a5ba00-34b9-11eb-86f3-81312884e4bb.png)

The layout shift score is a product of two measures: the [impact](https://web.dev/cls/#impact-fraction) and the [distance fraction](https://web.dev/cls/#distance-fraction). Check in the following how Lighthouse classifies CLS:

|CLS|Color-coding|
|--|--|
|Over 0.25|Red (poor)|
|0.1 - 0.25|Orange (needs improvement)|
|0 - 0.1|Green (good)|

This metric is mostly affected by images, ads, embeds, and iframes without pre-defined dimensions, and content dynamically inserted by JS on the client-side (e.g. a bar that suddenly appears on the header).