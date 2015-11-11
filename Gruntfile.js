module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		requirejs: {
			build: {
				options: {
					baseUrl: "./www/",
                    name: "app",
                    out: "./www/main.js",
					paths: {
						app: "./app",
					},
					optimize: "none",
					mainConfigFile: "./www/app.js",
				}
			},
			export: {
				options: {
					baseUrl: "./www/",
                    name: "app",
                    out: "./www/main.js",
					paths: {
						app: "./export",
					},
					optimize: "none",
					mainConfigFile: "./www/export.js",
				}
			},
        },
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	
	grunt.registerTask('build', ['requirejs:build']);
	grunt.registerTask('export', ['requirejs:export']);
};
