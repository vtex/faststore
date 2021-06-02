# gatsby-plugin-nginx

This plugin will output a `nginx.conf` template file at the root directory, containing *nginx* rules for every page, static asset, *createRedirect* call and pages with mistmatched *path*/*matchPath*.

[![NPM](https://img.shields.io/npm/v/@vtex/gatsby-plugin-nginx.svg)](https://www.npmjs.com/package/@vtex/gatsby-plugin-nginx) 

## Hosting locally

After building your gatsby site, you can launch nginx locally for testing or development. Here is an one-liner using docker:

```console
sed -i -e 's/\$PORT/80/' public/nginx.conf && docker run --rm --name local_nginx -v "$PWD/public/nginx.conf:/etc/nginx/nginx.conf" -v "$PWD/public:/etc/nginx/html" -p 80:80 -it nginx:latest
```

If no errors occur, your site will be available at http://localhost

All this one-liner does is:
- Replace the `$PORT` placeholder with an arbitrary port (80)
- Mount the generated configuration at `public/nginx.conf` to the default nginx path `/etc/nginx/nginx.conf`
- Mount the `public` folder to the default nginx root folder at `/etc/nginx/html`
- Name the container `local_nginx` for easy of use with other docker commands and instruct docker to remove (`--rm`) the container when it stops.

To copy over nginx access or error logs, you can then use:

```console
docker cp local_nginx:/var/log/nginx/error.log .
docker cp local_nginx:/var/log/nginx/access.log .
```

To enable debug level error logs, add `nginx-debug -g 'daemon off;'` at the end of the `docker run` command.

If you want to use a locally installed version of nginx instead of the docker imager, the paths included in these instructions might not work for you. To find out the paths used by your nginx distribution, you can use the following command:

```console
nginx -V
```

## Sample configuration


```js
// gatsby-config.js
module.exports = {
  // [...]
  plugins: [
    // [...]
    {
      resolve: '@vtex/gatsby-plugin-nginx',
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
error_log /var/log/nginx/error.log debug;
pid /var/log/nginx_run.pid;
events {
  worker_connections 1024;
}
http {
  access_log /var/log/nginx/access.log;
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

~~Note that the `proxy_pass` call uses the original request path (the *nginx* variable `$uri` above), so any *createRedirect* call with mistmatching *paths* will cause this plugin to throw an error for now. Let me (@cezar) know if we want/need to support this scenario.~~

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

### Adding custom blocks to nginx config
Our default nginx config may not be suited for all use cases. For those use cases where you need to enable/disable some extra flags in the `server` and `http` block you can use the `serverOptions` and `httpOptions` params respectively. 

For instance, say we don't want to use Google's dns server, but use the AWS one instead. One could configure the plugin like:
```js
// gatsby-config.js
module.exports = {
  // [...]
  plugins: [
    // [...]
    {
      resolve: '@vtex/gatsby-plugin-nginx',
      options: {
        // other options
        serverOptions: [['resolver', '169.254.169.253']],
      }
    },
  ],
}
```

This will create an `nginx.conf` file similar to: 
```
...
 server {
    resolver 169.254.169.253;
    ...
 }
...
```
