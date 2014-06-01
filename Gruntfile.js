module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bowercopy: {
      options: {
        clean: false
      },
      js: {
        options: {
          destPrefix: 'assets/js'
        },
        files: {
          'jquery.js': 'jquery/jquery.js',
          'jquery.imgpreload.js': 'jquery.imgpreload/jquery.imgpreload.js',
          'uikit.js': 'uikit/dist/js/uikit.js',
          'soundcloud.js': 'soundcloud/sdk.js',
        }
      },
      css: {
        options: {
          destPrefix: 'assets/css'
        },
        files: {
          'uikit.css': 'uikit/dist/css/uikit.css',
        }
      },
      fonts: {
        files: {
          'assets/fonts': 'uikit/dist/fonts'
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      app: {
        src: [
          './assets/js/jquery.js',
          './assets/js/uikit.js',
          './assets/js/soundcloud.js',
          './assets/js/main.js'
        ],
        dest: './public/js/app.js',
      }
    },

    uglify: {
      options: {
        mangle: false  // Because we don't want the names of our functions and variables to change
      },
      app: {
        files: {
          './public/js/app.js': './public/js/app.js',
        }
      }
    },

    less: {
      development: {
        options: {
          compress: true,  //minifying the result
        },
        files: {
          "./public/css/app.css":"./assets/css/app.less",
        }
      }
    },

    copy: {
      fonts: {
        cwd: 'assets/fonts',
        src: [ '**' ],
        dest: 'public/fonts',
        expand: true
      }
    },

    watch: {
      css: {
        files: ['assets/css/**/*.less'],
        tasks: ['less']
      },
      /* watch and see if our javascript files change */
      js: {
        files: ['assets/js/**/*.js'],
        tasks: ['concat','uglify']
      },
      /* watch and see if our other asset files change */
      fonts: {
        files: ['assets/fonts/*'],
        tasks: ['copy']
      },
      /* watch our files for changes, reload */
      livereload: {
        files: ['public/*.html', 'public/css/*.css', 'public/images/*', 'public/js/*.js'],
        options: {
          livereload: true
        }
      },
    },

    connect: {
      server: {
        options: {
          port: 4000,
          base: 'public',
          hostname: '*',
          livereload: true
        }
      }
    }

  });
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build',['bowercopy','concat','uglify','less','copy']);
  grunt.registerTask('default',['build','connect','watch']);
}