var crypto = require('crypto');

module.exports = function (grunt) {
    'use strict';

    var concatSrc = [
        'node_modules/phaser-ce/build/phaser.js',
        'node_modules/@orange-games/phaser-i18next/build/phaser-i18next.js',
        'node_modules/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.js',
        '_build/game.js'
    ];

    grunt.initConfig({
        
        game: grunt.file.readJSON('package.json'),
        
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: ['_build/dev', 'node_modules']
                }
            }
        },

        copy: {
            dev: {
                files: [
                    {expand: true, cwd: 'assets', dest: '_build/dev/assets', src: ['**/*']}
                ]
            },
            dist: {
                files: [
                    {expand: true, cwd: 'assets', dest: '_build/dist/assets', src: ['**/*', '!**/*.wav']}
                ]
            }
        },

        concat: {
            options: {
                separator: ';\n\n'
            },
            game: {
                src: ['src/game.js', 'src/**/*.js'],
                dest: '_build/game.js'
            },
            dist: {
                src: concatSrc,
                dest: '_build/dist/game-<%= game.version %>.js'
            },
            dev: {
                src: concatSrc,
                dest: '_build/dev/game.js'
            }
        },

        watch: {
            options: {
                livereload: true
            },
            assets: {
                files: ['assets/**/*.*'],
                tasks: ['copy:dev']
            },
            template: {
                files: ['templates/index.html'],
                tasks: ['htmlbuild:dev']
            },
            source: {
                files: ['src/**/*.js'],
                tasks: ['concat:game', 'babel:game', 'concat:dev', 'clean:game']
            }
        },

        babel: {
            options: {
                presets: ['env']
            },
            game: {
                files: {
                    '_build/game.js': '_build/game.js'
                }
            }
        },

        uglify: {
            options: {
                mangle: true,
                compress: true,
                beautify: false,
                sourceMap: false,
                preserveComments: false,
                report: "min",
                except: []
            },
            dist: {
                files: {
                    '_build/dist/game.min.js': '_build/dist/game-<%= game.version %>.js'
                }
            }
        },

        clean: {
            dist: ['_build/dist/*'],
            game: ['_build/game.js'],
            temp: ['_build/dist/*.js', '!_build/dist/*.min.js']
        },

        htmlbuild: {
            dist: {
                src: 'templates/dist.html',
                dest: '_build/dist/index.html',
                options: {
                    data: {
                        // Data to pass to templates
                        version: "<%= game.version %>",
                        title: "<%= game.title %>"
                    }
                }
            },
            dev: {
                src: 'templates/index.html',
                dest: '_build/dev/index.html',
                options: {
                    data: {
                        title: "<%= game.title %>"
                    }
                }                
            }
        },

        "gh-pages": {
            options: {
                base: "_build/dist"
            },
            src: ['**']
        }
    });

    grunt.registerTask('dist', [
        'clean:dist',
        'concat:game',
        'babel:game',
        'copy:dist',
        'concat:dist',
        'clean:game',
        'uglify:dist',
        'clean:temp',
        'htmlbuild:dist'
    ]);

    grunt.registerTask('dev', [
        'copy:dev',
        'concat:game',
        'babel:game',
        'concat:dev',
        'clean:game',
        'htmlbuild:dev',
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('deploy-gh', [
        'dist',
        'gh-pages'
    ]);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-gh-pages');
};