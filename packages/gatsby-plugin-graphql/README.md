## How to develop

Since graphql plugin should be a singleton and since it's hoisted from other packages, we need to make a small change into
graphql-js plugin

goto 
`gatsby-vtex/node_modules/graphql/jsutils/instanceOf.js`

and change the implementation of `instanceOf` to

```ts
function instanceOf(value, constructor) {
  return value instanceof constructor;
} : // eslint-disable-next-line no-shadow
function instanceOf(value, constructor) {
  if (value instanceof constructor) {
    return true;
  }

  if (value) {
    var valueClass = value.constructor;
    var className = constructor.name;

    if (className && valueClass && valueClass.name === className) {
      return true
    }
  }

  return false;
};
```

this should make the realm error to disapear
