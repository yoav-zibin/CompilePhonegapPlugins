module.exports = function (grunt) {
    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            default: {
                tsconfig: true
            }
        },
    };
    var defaultTasks = [];
    function addTask(plugin, params) {
        if (!gruntConfig[plugin])
            gruntConfig[plugin] = {};
        var taskName = "Task" + defaultTasks.length;
        gruntConfig[plugin][taskName] = params;
        var task = plugin + ":" + taskName;
        defaultTasks.push(task);
        return task;
    }
    function addCopyTask(src, dest, processOptions, cwd) {
        console.log("Copying " + src + " to " + dest);
        var params = {
            src: src,
            dest: dest,
            expand: cwd ? true : false,
            options: !processOptions ? {} : {
                process: processOptions,
            },
        };
        if (cwd)
            params.cwd = cwd;
        addTask("copy", params);
    }
    function addUglifyTask(src, dest, withSourceMaps, banner) {
        var options = {
            sourceMap: withSourceMaps,
        };
        if (banner)
            options.banner = banner;
        addTask("uglify", {
            options: options,
            files: (_a = {},
                _a[dest] = [
                    src,
                ],
                _a),
        });
        var _a;
    }
    function addConcatTask(src, dest) {
        addTask("concat", {
            options: {
                separator: '\n;\n',
            },
            src: src,
            dest: dest
        });
    }
    function mustReplace(str, from, to) {
        var res = str.replace(from, to);
        if (res == str)
            throw new Error("Couldn't find '" + from + "' in string '" + str + "'");
        return res;
    }
    var OUTPUT = "output/";
    function minifyJs(jsFiles, dest) {
        var minified_dest = mustReplace(dest, ".js", ".min.js");
        var non_minified_dist_private = OUTPUT + dest;
        var minified_dist_private = OUTPUT + minified_dest;
        addConcatTask(jsFiles, non_minified_dist_private);
        // If I want to temporarily turn off minification and just copy: addCopyTask(non_minified_dist_private, minified_dist_private);
        addUglifyTask(non_minified_dist_private, minified_dist_private, true);
    }
    for (var _i = 0, _a = ["android", "ios"]; _i < _a.length; _i++) {
        var phonegapPlatform = _a[_i];
        var cordovaFiles = [
            "./cordova_plugins_" + phonegapPlatform + '/cordova.js',
            "./cordova_plugins_" + phonegapPlatform + '/cordova_plugins.js',
            "./cordova_plugins_" + phonegapPlatform + '/plugins/**/*.js'
        ];
        var fileName = "phonegapPlugins." + phonegapPlatform + ".v1";
        minifyJs(cordovaFiles, fileName + ".js");
    }
    finishGruntConf();
    function finishGruntConf() {
        //console.log(JSON.stringify(gruntConfig, null, ' '));
        // Project configuration.
        grunt.initConfig(gruntConfig);
        require('load-grunt-tasks')(grunt);
        // Default task(s).
        grunt.registerTask('default', defaultTasks);
    }
};
//# sourceMappingURL=Gruntfile.js.map