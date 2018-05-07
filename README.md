# CompilePhonegapPlugins

Steps to compile phonegap plugins:

1. Delete everything from directories `cordova_plugins_ios` and `cordova_plugins_android`.
2. Copy the entire plugin directory into `cordova_plugins_ios` and `cordova_plugins_android`.
3. `npm install`
4. `tsc & grunt`
5. Copy the `output` directory into `NewGamePortal/public/cordova`