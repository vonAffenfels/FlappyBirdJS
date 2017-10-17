var path = require("path");

module.exports = function (grunt) {
    'use strict';

    // Phaser webpack config
    var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
    var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
    var pixi = path.join(phaserModule, 'build/custom/pixi.js');
    var p2 = path.join(phaserModule, 'build/custom/p2.js');

    var phaseri18next = path.join(__dirname, '/node_modules/@orange-games/phaser-i18next/build/phaser-i18next.min');

    grunt.initConfig({
        
        game: grunt.file.readJSON('package.json'),
        
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: ['_build/']
                }
            }
        },

        copy: {
            game: {
                files: [
                    {expand: true, cwd: 'assets', dest: '_build/assets', src: ['**/*', '!**/*.wav']}
                ]
            }
        },

        webpack: {
            game: {
                entry: {
                    app: [path.resolve(__dirname, 'src/game')]
                },
                module: {
                    rules: [
                        { 
                            test: /\.js$/,
                            exclude: /node_modules/,
                            use: [
                                {
                                    loader: 'babel-loader', 
                                    query: {
                                        presets: ['env']
                                    }
                                }
                            ], 
                            include: path.join(__dirname, 'src') 
                        },
                        { 
                            test: /pixi\.js/, 
                            use: ['expose-loader?PIXI'] 
                        },
                        { 
                            test: /phaser-split\.js$/, 
                            use: ['expose-loader?Phaser'] 
                        },
                        { 
                            test: /p2\.js/, 
                            use: ['expose-loader?p2'] 
                        },
                        { 
                            test: /phaser-i18next\./, 
                            use: ['script-loader'] 
                        }
                    ]
                },
                output: {
                    pathinfo: true,
                    path: path.resolve(__dirname, '_build'),
                    publicPath: "./_build",
                    filename: 'game.js'
                },
                resolve: {
                    alias: {
                        'phaser': phaser,
                        'pixi': pixi,
                        'p2': p2,
                        'phaser-i18next': phaseri18next
                    }
                }
            },
        },

        watch: {
            options: {
                livereload: true
            },
            assets: {
                files: ['assets/**/*.*'],
                tasks: ['copy:game']
            },
            template: {
                files: ['templates/index.html'],
                tasks: ['htmlbuild:game']
            },
            source: {
                files: ['src/**/*.js'],
                tasks: ['webpack:game']
            }
        },

        /*uglify: {
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
        },*/

        clean: {
            game: ['_build/**']
        },

        htmlbuild: {
            dist: {
                src: 'templates/index.html',
                dest: '_build/index.html',
                options: {
                    data: {
                        // Data to pass to templates
                        version: "'<%= game.version %>'",
                        title: "<%= game.title %>"
                    }
                }
            },
            dev: {
                src: 'templates/index.html',
                dest: '_build/index.html',
                options: {
                    data: {
                        title: "<%= game.title %>",
                        version: "Date.now()"
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
        'clean:game',
        'copy:game',
        'htmlbuild:dev',
        'webpack:game',
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('deploy-gh', [
        'dist',
        'gh-pages'
    ]);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-gh-pages');
};