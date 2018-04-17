
module.exports = function(grunt: IGrunt) {

  let gruntConfig: any = {
    pkg: grunt.file.readJSON('package.json'),
    ts: {
      default : {
        tsconfig: true
      }
    },
  };
  let defaultTasks: string[] = [];

  function addTask(plugin: string, params: any) {
    if (!gruntConfig[plugin]) gruntConfig[plugin] = {};
    let taskName = "Task" + defaultTasks.length;
    gruntConfig[plugin][taskName] = params;
    let task = plugin + ":" + taskName;
    defaultTasks.push(task);
    return task;
  }
  function addCopyTask(src: string, dest: string, processOptions?: any, cwd? : string) {
    console.log("Copying " + src + " to " + dest);
    let params: any = {
      src: src,
      dest: dest,
      expand: cwd ? true : false,
      options: !processOptions ? {} : {
        process: processOptions,
      },
    };
    if (cwd) params.cwd = cwd;
    addTask("copy", params);
  }
  
  function addUglifyTask(src: string, dest: string, withSourceMaps: boolean, banner?: string) {
    let options: any = {
        sourceMap: withSourceMaps,
      };
    if (banner) options.banner = banner;
    addTask("uglify", {
      options: options,
      files: {
        [dest]: [
          src,
        ]
      },
    });
  }

  function addConcatTask(src: string[], dest: string) {
    addTask("concat", {
      options: {
        separator: '\n;\n',
      },
      src: src,
      dest: dest
    });
  }
  function mustReplace(str: string, from: string, to: string) {
    let res = str.replace(from, to);
    if (res == str) throw new Error("Couldn't find '" + from + "' in string '" + str + "'");
    return res;
  }
  const OUTPUT = "output/";
  function minifyJs(jsFiles: string[], dest: string) {
    let minified_dest = mustReplace(dest, ".js", ".min.js");
    let non_minified_dist_private = OUTPUT + dest;
    let minified_dist_private = OUTPUT + minified_dest;
    addConcatTask(jsFiles, non_minified_dist_private);

    // If I want to temporarily turn off minification and just copy: addCopyTask(non_minified_dist_private, minified_dist_private);
    addUglifyTask(non_minified_dist_private, minified_dist_private, true);
  }

  
  for (let phonegapPlatform of ["android", "ios"]) {
    let cordovaFiles = [
        "./cordova_plugins_" + phonegapPlatform + '/cordova.js',
        "./cordova_plugins_" + phonegapPlatform + '/cordova_plugins.js',
        "./cordova_plugins_" + phonegapPlatform + '/plugins/**/*.js'];
    let fileName = "phonegapPlugins." + phonegapPlatform + ".v1";
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

