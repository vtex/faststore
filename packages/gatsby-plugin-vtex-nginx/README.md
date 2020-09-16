# gatsby-plugin-vtex-nginx

This plugin will output a `nginx.out.conf` template file at the root directory, containing *nginx* rules for every page, static asset, *createRedirect* call and pages with mistmatched *path*/*matchPath*.

## Sample configuration


```js
// gatsby-config.js
module.exports = {
  // [...]
  plugins: [
    // [...]
    {
      resolve: require.resolve('@vtex/gatsby-plugin-vtex-nginx'),
      options: {
        transformHeaders: (headers, path) => {
          const DEFAULT_SECURITY_HEADERS = [
            'X-XSS-Protection: 1; mode=block',
            'X-Content-Type-Options: nosniff',
            'Referrer-Policy: same-origin',
          ]

          return path.includes('/preview')
            ? [...DEFAULT_SECURITY_HEADERS, 'Content-Security-Policy: frame-src https://*.myvtex.com/', ...headers]
            : ['X-Frame-Options: DENY', ...DEFAULT_SECURITY_HEADERS, ...headers]
        },
      }
    },
  ],
}
```

## Sample output

```nginx
worker_processes 3;
worker_rlimit_nofile 8192;
error_log /var/log/nginx_errors.log debug;
pid /var/log/nginx_run.pid;
events {
  worker_connections 1024;
}
http {
  access_log /var/log/nginx_access.log;
  server {
    listen 0.0.0.0:8080 default_server;
    resolver 8.8.8.8;
    location = /gorgeous-watch/p {
      add_header X-Frame-Options "DENY";
      add_header X-XSS-Protection "1; mode=block";
      add_header X-Content-Type-Options "nosniff";
      add_header Referrer-Policy "same-origin";
      add_header Link "</commons~253ae210-6f947986d9c5bc2d04a1.js>; rel=preload; as=script";
      proxy_pass https://s3.amazonaws.com/${BUCKET}/${BRANCH}/public/gorgeous-watch/p/index.html;
    }
    location = /commons~253ae210-6f947986d9c5bc2d04a1.js {
      add_header X-Frame-Options "DENY";
      add_header X-XSS-Protection "1; mode=block";
      add_header X-Content-Type-Options "nosniff";
      add_header Referrer-Policy "same-origin";
      add_header Cache-Control "public, max-age=31536000, immutable";
      proxy_pass https://s3.amazonaws.com/${BUCKET}/${BRANCH}/public/commons~253ae210-6f947986d9c5bc2d04a1.js;
    }
    location ~* ^/api/.* {
      proxy_pass https://storecomponents.vtexcommercestable.com.br$uri$is_args$args;
      proxy_ssl_server_name on;
    }
    location / {
      try_files /dev/null @s3;
    }
    location @clientSideFallback {
      rewrite ^/[^/]+/p /__client-side-product__/p last;
      rewrite ^/pt/[^/]+/p /pt/__client-side-product__/p last;
      rewrite ^/.* /__client-side-search__ last;
      rewrite ^/pt/.* /pt/__client-side-search__ last;
      return 404;
    }
    error_page 403 = @clientSideFallback;
    location @s3 {
      proxy_pass https://s3.amazonaws.com/${BUCKET}/${BRANCH}/public$uri;
      proxy_intercept_errors on;
    }
  }
}
```

### How it works

---

Every page and static asset are matched by an *exact match location*:
```nginx
location = /gorgeous-watch/p {}
```

Additionally, pages include `Link` headers to its dependencies, and static assets include the `Cache-Control: public, max-age=31536000, immutable` header.

---

Gatsby's *createRedirect* calls which *toPath* is an absolute URI become a regex location that proxies the request to that URL:

```nginx
    location ~* ^/api/.* {
      proxy_pass https://storecomponents.vtexcommercestable.com.br$uri$is_args$args;
      proxy_ssl_server_name on;
    }
```

Note that the `proxy_pass` call uses the original request path (the *nginx* variable `$uri` above), so any *createRedirect* call with mistmatching *paths* will cause this plugin to throw an error for now. Let me (@cezar) know if we want/need to support this scenario.

---

If an incoming request does not match any of these classes of location, it could be either a non-cached asset (such as `page-data.json`) or a product page that we did not build.

So we first check if we have a matching file on storage with a catch-all, lowest-priority location rule:

```nginx
location / {
    try_files /dev/null @s3;
}
```

The `try_files` above is the nginx equivalent of a `goto`, and will send the request to the location named `@s3`:

```nginx
error_page 403 = @clientSideFallback;
location @s3 {
    proxy_pass https://s3.amazonaws.com/${BUCKET}/${BRANCH}/public$uri;
    proxy_intercept_errors on;
}
```

This location, similary to the others, will try and proxy the request to our storage, but this time we will intercept proxy errors, and in such case that a file does not exist on storage (i.e, product pages that were not built), S3 returns a status code 403 and the `error_page` directive above will send the request to the location named `@clientSideFallback`:

```nginx
location @clientSideFallback {
    rewrite ^/[^/]+/p /__client-side-product__/p last;
    rewrite ^/pt/[^/]+/p /pt/__client-side-product__/p last;
    rewrite ^/.* /__client-side-search__ last;
    rewrite ^/pt/.* /pt/__client-side-search__ last;
    return 404;
}
```

This location finally handles pages with mismatching *path* and *matchPath*.

`createRedirect` with relative paths are not yet implemented. 

