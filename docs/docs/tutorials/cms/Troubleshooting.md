# Troubleshooting 

Throughout this tutorial, you may come across common errors that have already tricked other FastStore users. This article is intended to help you troubleshoot some of these issues.

## Error installing the Headless CMS plugin of VTEX IO CLI 

If you are a Windows user, you may find the following error after requesting to install the VTEX Headless CMS plugin of VTEX IO CLI:

```
vtex plugins install cms
warning "@vtex/cli-plugin-cms > @vtex/api > apollo-server-core > apollo-graphql@0.9.5" has incorrect peer dependency "graphql@^14.2.1 || ^15.0.0".
Installing plugin @vtex/cli-plugin-cms... failed
    Error: EPERM: operation not permitted, symlink 
    'C:\Users\LukeSkywalker\AppData\Roaming\npm\node_modules\vtex' ->
    'C:\Users\LukeSkywalker\AppData\Local\vtex\node_modules\vtex'
    Code: EPERM
```    

To solve this issue, please launch the Windows Terminal as administrator. Then, run `vtex cms`.

![](/img/tutorials/cms/troubleshooting-cms.jpeg)

This will allow the system to create the [symbolic link](https://en.wikipedia.org/wiki/Symbolic_link) necessary for running commands from the VTEX Headless CMS plugin.