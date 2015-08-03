'use strict';

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		watch: {
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
					'views/**/*.html',
					'tpl/*.html'
				]
			}
		},

		connect: {
			options: {
				port: 9000,
				hostname: 'localhost',
				livereload: 35729
			},
			proxies: [{
				context: ['/WebApi/api', '/WebApi/Uploads'],
				host: 'localhost',
				port: 18289
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
};