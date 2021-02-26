## Description

This plugin integrates `gatsby-theme-store` with Google Tag Manager.

## How to install

Just run `npm i @vtex/gatsby-plugin-google-tag-manager` in the root of your code.

## Available options (if any)

- `gtmId` **required**: the ID of the Google Tag Manager container.
- `dataLayerConfig` **optional**: this options informs what are the options that you want to have in your data layer. By default we pass `[{ 'gtm.blacklist': ['html'] }]`. If you want to be able to use Custom HTML tags in Google Tag Manager, use `[]` in this option.

## When do I use this plugin?

When you want to use Google Tag Manager and have the Google Enhanced Ecommerce events.

## Examples of usage

## How to run tests

## How to develop locally

## How to contribute
