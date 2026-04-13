#!/usr/bin/env bash

# Generate final shcema.json to headless cms
vtex content generate-schema cms/faststore/components cms/faststore/pages -o cms/faststore/schema.json -b vtex.faststore4

# Upload final schema.json to headless cms
expect -c 'spawn vtex content upload-schema cms/faststore/schema.json; expect "store ID"; send "faststore\r"; expect "uploaded with"; send "y\r"; expect "Are you sure"; send "y\r"; expect eof' 2>&1;