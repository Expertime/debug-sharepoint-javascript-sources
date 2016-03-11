# Debug Sharepoint Javascript Sources
## Description

This chrome extension gives access to the debug-version of the SharePoint Javascript source files.

You can find it on the [chrome web store][1].

This is the work of [Serge ARADJ](https://github.com/orty) with a little help from [Emmanuel KREBS](https://github.com/e-krebs).


## How to enable it
Once installed from the [chrome web store][1] (or locally by cloninf this repository), you'll see a new icon appearing next to chrom's menu : 
this browser action is by default deactivated ![deactivated browser action](icons/icon19_disabled.png).

When you __left-click__ ont his icon, you'll toggle its state.
When enabled, it is colored
![deactivated browser action](icons/icon19.png)

## How it works
Once enabled, what this extension will do is fairly simple.
All work is done by the [`background.js`](/background.js) file.
- requests matching one of the following url patterns are listened :
    ```
    '*://*.sharepointonline.com/*/_layouts/15/*/*.js',
    '*://*.sharepoint.com/_layouts/15/*/*.js'
    ```
- for each of these requests
    - if the url is of the form `*.debug.js` or `*.start.js`, nothing is done and the request will be resolved as usual
    - otherwise, the `.debug.js` version of the url is requested. If it exists (request.status == 200), the request is redirected to this debug version.

That's it !

#License
[MIT](/LICENSE)

[1]: https://chrome.google.com/webstore/detail/debug-sharepoint-javascri/okfjnbcodjjeenchhkkfblbdnpfnpidm