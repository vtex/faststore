# @vtex/gatsby-plugin-onesignal

A simple Gatsby plugin to add [OneSignal](https://onesignal.com) integration into your Gatsby site.

## Install

To install this plugin, simply run:

```
yarn add @vtex/gatsby-plugin-onesignal
```

or

```
npm install @vtex/gatsby-plugin-onesignal
```

## Configuration options and defaults

To make this plugin easy to use and fast to setup, we're using the "Typical Site" integration that OneSignal offers along with customized service worker paths and filenames, to avoid any conflicts with existing service workers your site may already have. 

Make sure you have the following selected in your OneSignal admin panel:

![OneSignal Web Configuration admin panel](https://user-images.githubusercontent.com/27777263/117006085-60a32380-acbe-11eb-84b9-57aed02a0812.png)

Also, in the advanced section, we're using a few default values that you should change to make this plugin work as is:

![OneSignal Web Configuration admin panel (advanced section)](https://user-images.githubusercontent.com/27777263/117006425-cd1e2280-acbe-11eb-821c-cb1b546a11a4.png)

Assuming your OneSignal setup is correct, you're going to receive an `appId` for your site. This `appId` is the only required option for this plugin to work, so you should add this to your site's `gatsby-config.js` file:

```js
  plugins: [
    {
      resolve: `@vtex/gatsby-plugin-onesignal`,
      options: {
        oneSignalAppId: "YOUR-APP-ID-HERE"
      },
    },
  ]
```

Here's a list of all available options for this plugin and their default values:

| Prop name | Type     | Description                                                   | Default value |
| --------- | -------- | ------------------------------------------------------------- | ------------- |
| `oneSignalAppId`  | `string`  | Your OneSignal `appId`. This option is **always required**. | `undefined`   |
| `pathToOneSignalFiles`  | `string` | This should match the `Path to service worker files` option found in the advanced section of your site's OneSignal admin panel. In most cases this should also match the `Service worker registration scope` option.    | `"push/onesignal"`   |
| `mainSWFileName`  | `string` | This should match the `Main service worker filename` option found in the advanced section of your site's OneSignal admin panel.   | `"onesignalsdkworker.js"`   |
| `updaterSWFileName`  | `string` | This should match the `Updater service worker filename` option found in the advanced section of your site's OneSignal admin panel.   | `"onesignalsdkupdaterworker.js"`   |
