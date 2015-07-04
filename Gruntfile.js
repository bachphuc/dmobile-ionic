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
        },
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	
	grunt.registerTask('build', ['requirejs:build']);
};
