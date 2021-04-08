# Master Data
The Master Data API documentation is based on the following schema:

```ts
{
  name: { type: "string" },
  email: { type: "string" },
}
```

## mastData

This section describes the `masterData` constructor and its parameters.

### Properties

| Property | Required |
|----------|----------|
| entity   | true     |

Example

```ts
import masterData from '@vtex/gatsby-theme-store'

const md = masterData('NL')
```

> `NL` is the entity


## Queries

### create

`create` a new document.

#### Example

```ts
const document = await md.create({
  name: 'Emerson',
  email: 'emerson@example.com',
})
```

### upsert

`upsert` query updates a document if it exists, or creates a new.

#### Example

Suppose we have this document:
```ts
{
  id: "document-generated-id",
  name: "Emerson",
  email: "emerson@example.com"
}
```

So let's do an `upsert`:
```ts
const document = await md.upsert({
  id: "document-generated-id"
  email: "laurentino@example.com"
})
```

The document will now look like this:
```ts
{
  id: "document-generated-id",
  email: "laurentino@example.com"
}
```

> As the document already existed, it was replaced by the new data.

### upsertial

Similar to `upsert`, the `upsertial` query updates partial data of document if it exists, or creates a new.

The difference is that data that is not requested for updating will be kept.

#### Example

Suppose we have this document:

```ts
{
  id: "document-generated-id",
  name: "Emerson",
  email: "emerson@example.com"
}
```

So let's do an `upsertial`:

```ts
const document = await md.upsertial({
  id: "document-generated-id"
  email: "laurentino@example.com"
})
```

The document will now look like this:

```ts
{
  id: "document-generated-id",
  name: "Emerson",
  email: "laurentino@example.com"
}
```

> As the document already existed, and the update was partial, only the email field was changed.

### update

`update` updates an existing document.

Similar to `upsert`, however it does not create a document does not exist.

> the update is entire

#### Example

```ts
const document = await md.update("document-generated-id", {
  name: 'Emerson',
  email: 'emerson@example.com',
})
```

### findUnique

`findUnique` method lets you retrieve a single document by id.

#### Example

```ts
const document = await md.findUnique("document-generated-id")
```

### delete
`delete` method deletes a document by id.

#### Example

```ts
const document = await md.delete("document-generated-id")
```
