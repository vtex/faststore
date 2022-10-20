# Analytics on Store Framework and FastStore comparison

This article presents some of the main differences between analytics implementation on FastStore and [VTEX Store Framework](https://vtex.com/br-pt/store-framework/).

To handle Google Analytics in **Store Framework**, an **IO app** that implements the GTM script, including event properties and adding the events to the `dataLayer`, is used. In FastStore, there's no equivalent piece. All of that is done in the store itself. Both paradigms bring positive and negative implications. In this article, we'll go through important topics that highlight the contrast between the FastStore approach and the Store Framework approach when handling analytics.

## Autonomy

The FastStore way of approaching analytics gives developers autonomy. They are not tied to any of the choices we've made for starters or FastStore SDK. You can fire your own events, customize them with your own types, and add your properties of choice. This empowers developers and store managers to collect data the way they prefer. We have guides on [How to extend and customize types](https://www.faststore.dev/reference/sdk/analytics/how-to-extend-types) and [How to send custom events](https://www.faststore.dev/reference/sdk/analytics/how-to-send-custom-events).

This is quite different from the Store Framework approach. If you need to deviate even a little from the Google Tag Manager **IO app** choices, you may need to detach from the whole app and create your own solution. Still, you'll be limited by the DOM events fired by native apps and blocks and the information they contain. To change that, you would have to detach from the native apps, which defeats the purpose of using Store Framework.

While Store Framework offers a more all-or-nothing approach to analytics that is easier to handle and maintain, FastStore focuses on the autonomy and power analytics solutions usually require to fulfill the needs of every store. FastStore also makes using [GA custom dimensions](https://support.google.com/analytics/answer/2709828) easier, which is great for building custom reports and adding custom data to reports.

## Responsibility

With great power comes great responsibility. While FastStore gives developers the autonomy to build the analytics solutions they need, it deposits the responsibility of doing so on these developers. The events won't fire if you install FastStore SDK, nor will they be complete for every case. You have to fire the event you want with the information you need at the right moment, and that's up to you. Of course, official starters include GA4 Enhanced Ecommerce events, but that can also be deleted if developers are negligent. Hence, the project maintainers have to actively care about their analytics implementation.

> Maintainers of FastStore project have to actively care about their analytics implementation.

Store Framework gives analytics events for free. You barely have to worry about it if you use the native GTM app and native blocks to compose your pages. This is great, but it comes with the limitations presented in the previous section.

## Visibility

With Store Framework, it's difficult to know where or when an event is fired. This makes it harder to debug problems and customize events. In FastStore, everything lives in the store repository. Just search for [`sendAnalyticsEvent`](https://www.faststore.dev/reference/sdk/analytics/sendAnalyticsEvent) calls and you'll see where events are being fired and the conditions for that to happen.

Also, FastStore provides E2E tests for all GA4 Enhanced Ecommerce analytics events it includes, so you can quickly know if something wrong with your analytics implementation. You'll be able to fix these issues before you start to lose valuable user data.