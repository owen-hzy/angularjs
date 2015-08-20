'use strict';

module.exports = function(grunt) {
	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
			js: {
				files: ['js/**/*.js', 'Gruntfile.js'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'index.html',
					'views/*.html',
					'tpl/*.html',
                    'images/*.{png,jpg,jpeg,gif,svg}'
				]
			}
		},

		connect: {
			options: {
				port: 9000,
				hostname: '0.0.0.0',
				livereload: 35729
			},
			proxies: [{
				context: ['/WebApi/api', '/WebApi/Uploads'],
				host: 'localhost',
				port: 8080
			}],
			livereload: {
				options: {
					open: true,
					middleware: function(connect, options) {
						var mockRequests = require('mock-rest-request');
						var middlewares = [];

						// Setup the mock service
						middlewares.push(mockRequests());
						// Setup the proxy
						middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
						// Serve static files
						options.base.forEach(function(base) {
							middlewares.push(connect.static(base));
						});

						return middlewares;
					}
				}
			},
            dist: {
                options: {
                    open: true,
                    base: 'dist'
                }
            }
		},

        clean: {
            dist: {
                src: ['dist']
            }
        },

        wiredep: {
            app: {
                src: ['index.html']
            }
        },

        useminPrepare: {
            html: 'index.html',
            options : {
                dest: 'dist'
            }
        },

        usemin: {
            html:  'dist/index.html'
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'images',
                    src: '*.{png, jpg, jpeg, gif}',
                    dest: 'dist/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeOptionalTags: true,
                    collapseBooleanAttributes: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['index.html', 'views/*.html', 'tpl/*.html'],
                    dest: 'dist'
                }]
            }
        },

        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: ['*.js', '!oldieshim.js'],
                    dest: '.tmp/concat/js'
                }]
            }
        },

        /*uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/js',
                    src: ['*.js'],
                    dest: 'dist/js',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
        },

        concat: {
            dist: {
                files: [{
                    'dist/js/concat.js': ['js/!**!/!*.js']
                }]
            }
        },*/

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.',
                    src: ['*.html', 'views/*.html', 'tpl/*.html', '*.ico'],
                    dest: 'dist'
                },{
                    expand: true,
                    cwd: '.',
                    src: ['assets/admin/layout4/img/*.{jpg,jpeg,png,gif}'],
                    dest: 'dist/img',
                    flatten: true,
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'assets/global/plugins/font-awesome/fonts',
                    src: ['*.*'],
                    dest: 'dist/fonts'
                }, {
                    expand: true,
                    cwd: 'assets/global/plugins/simple-line-icons/fonts',
                    src: ['*.*'],
                    dest: 'dist/styles/fonts'
                }
                ]
            },
            add: {
                files: [{
                    expand:true,
                    cwd: 'bower_components/angular-ui-grid',
                    src: ['*.{eot,svg,ttf,woff}'],
                    dest: 'dist/styles'
                }]
            }
        }
	});

	grunt.registerTask('serve', function() {
		grunt.task.run([
			'configureProxies:server',
			'connect:livereload',
			'watch'
		]);
	});

    grunt.registerTask('build', function() {
        grunt.task.run([
            // Do Concat first, then do uglify
            'clean:dist',
            'imagemin:dist',
            'useminPrepare',
            'concat',
            'ngAnnotate',
            'uglify',
            'cssmin',
            'copy:dist',
            'usemin',
            'htmlmin'
        ]);
    })
};