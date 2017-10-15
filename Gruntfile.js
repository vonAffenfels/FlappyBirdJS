var crypto = require('crypto');

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        // Get some details from the package.json
        game: grunt.file.readJSON('package.json'),
        // Configure the connect server that will be run
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
                    {expand: true, cwd: 'assets/images', dest: '_build/dist/assets/images', src: ['**/*']},
                    {expand: true, cwd: 'assets/sounds', dest: '_build/dist/assets/sounds', src: ['**/*', '!**/*.wav']},
                    {expand: true, cwd: 'assets/fonts', dest: '_build/dist/assets/fonts', src: ['**/*']}
                ]
            }
        },

        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: '_build/dist/<%= game.name %>-<%= game.version %>.js'
            },
            dev: {
                src: ['src/**/*.js'],
                dest: '_build/dev/<%= game.name %>.js'
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
                tasks: ['concat:dev']
            }
        },

        uglify: {
            options: {
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true
                },
                mangle: true
            },
            dist: {
                files: {
                    '_build/dist/<%= game.name %>.min.js': [
                        'node_modules/phaser-ce/build/phaser.min.js',
                        '_build/dist/<%= game.name %>-<%= game.version %>.js'
                    ]
                }
            }
        },

        clean: {
            dist: ['_build/dist/*'],
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
                        gameName: "<%= game.name %>",
                        title: "<%= game.title %>"
                    }
                }
            },
            dev: {
                src: 'templates/index.html',
                dest: '_build/dev/index.html',
                options: {
                    data: {
                        // Data to pass to templates
                        version: "<%= game.version %>",
                        gameName: "<%= game.name %>",
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
        'copy:dist',
        'concat:dist',
        'uglify:dist',
        'clean:temp',
        'htmlbuild:dist'
    ]);

    grunt.registerTask('dev', [
        'copy:dev',
        'concat:dev',
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
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-nw-builder');
};