---
id: session
keywords: [session, regionalization]
---

# Session

The FastStore SDK session module manages the state of session information in the shopper's browser. This includes currency, channel, localization and shopper data.

## Session object structure

Below you can see details of the session data managed by the session SDK module.

### Session

| **Field**    | **Type** | **Description**                                               |
| ------------ | -------- | ------------------------------------------------------------- |
| `locale`     | String   | Session locale (e.g., "en-US").                               |
| `currency`   | Object   | Session currency object. See fields details below.            |
| `country`    | String   | Session country three letter ISO code (e.g., "BRA").          |
| `channel`    | String   | Session channel.                                              |
| `postalCode` | String   | Session postal code.                                          |
| `person`     | Object   | Session shopper information object. See fields details below. |

#### Currency

| **Field** | **Type** | **Description**                           |
| --------- | -------- | ----------------------------------------- |
| `code`    | String   | Currency three letter code (e.g., "USD"). |
| `symbol`  | String   | Currency symbol (e.g., "$").              |

#### Person

| **Field**    | **Type** | **Description**                                         |
| ------------ | -------- | ------------------------------------------------------- |
| `id`         | String   | Shopper ID in case it exists in the ecommerce platform. |
| `email`      | String   | Email address provided by the shopper.                  |
| `givenName`  | String   | Shopper given name.                                     |
| `familyName` | String   | Shopper family name.                                    |
