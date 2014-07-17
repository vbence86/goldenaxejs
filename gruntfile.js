module.exports = function(grunt){
  grunt.initConfig({

    csslint: {
      strict: {
        src: ['dist/css/*.css']
      },
      lax: {
        options: {
          csslintrc: '.csslintrc'
        },
        src: ['dist/css/main.css']
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'dist/css/main.css': 'sass/main.scss'
        }
      }
    },

    jshint: {
      all: ['scripts/**/*.js']
    },

  concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'scripts/universe.js',
          'scripts/toolkit.js',
          'scripts/preloader.js',
          'scripts/uihandler.js',
          'scripts/game.js',
          'scripts/main.js'
        ],
        dest: 'dist/js/goldenaxe.js',
      },
    },

    uglify: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/js/goldenaxe.min.js': 'dist/js/goldenaxe.js'
        }
      },
      dev: {
        options: {
          compress: false,
          beautify: true,
          mangle: false
        },
        files: {
          'dist/js/goldenaxe.min.js': 'dist/js/goldenaxe.js'
        }  
      }
    },

    watch: {
      css: {
        files: ['sass/*.scss'],
        tasks: ['sass:dist'],
        options: {
          livereload: true
        }
      },
      csslint: {
        files: ['dist/css/*.css'],
        tasks: ['csslint:lax']
      },
      js: {
        files: ['scripts/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify:dev'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['sass', 'csslint:lax', 'concat', 'uglify:dev']);
}