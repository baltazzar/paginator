module.exports = function(grunt) {

	var path = require('path');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: [
		'/**\n',
		' * Baltazzar Paginator\n',
		' * Versão: <%= pkg.version %>\n',
		' * Módulo front-end de paginação de dados.\n',
		' * Autor: Victor Bastos\n',
		' */'
		].join(''),
		handlebars: {
			options: {
				namespace: 'Handlebars.templates',
				processName: function(filePath) {
					filePath = filePath.split('templates/');
					return 'paginator/' + filePath[1];
				},
				processPartialName: function(filePath) {
					filePath = filePath.split('templates/');
					return 'paginator/' + filePath[1];
				}
			},
			paginator: {
				src: ['src/templates/paginator.tpl'],
				dest: 'src/templates.js'
			}
		},
		watch: {
			files: {
				files: ['**/*.{html,htm,css,js,png,jpg,gif}'],
				options: {
					interval: 700
				}
			},
			templates: {
				files: 'src/templates/**/*.tpl',
				tasks: ['handlebars'],
				options: {
					atBegin: true
				}
			}
		},
		jshint: {
			options: {
				'-W030'  : true,
				'-W061'  : true,
				'-W116'  : true,
				'-W041'  : true,
				'-W069'  : true
			},
			files: ['src/**/*.js', '!src/templates.js']
		},
		requirejs: {
			options: {
				paths: {
					backbone   : 'empty:',
					jquery     : 'empty:',
					handlebars : 'empty:',
					marionette : 'empty:'
				},
				baseUrl: 'src',
				findNestedDependencies: true,
				wrap: {
					start: '<%= banner %>'
				},
				name: 'paginator'
			},
			normal: {
				options: {
					optimize: 'none',
					out: 'dist/paginator.js'
				}
			},
			min: {
				options: {
					optimize: 'uglify2',
					uglify2: {
						output: {
							comments: false
						}
					},
					out: 'dist/paginator.min.js'
				}
			}
		}
	});

	grunt.registerTask('compile', ['handlebars']);
	grunt.registerTask('dev', ['watch']);
	grunt.registerTask('build', ['handlebars', 'jshint', 'requirejs']);

	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
};