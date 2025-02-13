module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concat: {
      options: {
        separator: ";",
      },
      dist: {
        src: ["src/index.js", "src/**/*.js"],
        dest: "dist/<%= pkg.name %>.js",
      },
    },
    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      },
      dist: {
        files: {
          "dist/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"],
        },
      },
    },
    jshint: {
      files: ["Gruntfile.js", "src/**/*.js", "test/**/*.js"],
      options: {
        esversion: 6,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
        },
      },
    },
    watch: {
      files: ["<%= jshint.files %>"],
      tasks: ["jshint", "qunit"],
    },
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");

  grunt.registerTask("test", ["jshint"]);

  grunt.registerTask("default", ["jshint", "concat", "uglify"]);
};
