module.exports = function(grunt) {

	grunt.initConfig({
		"jshint": {
			"dist": {
				"files": {
					"src": ["src/*.js"]
				},
				"options": {
					"jshintrc": true
				}
			}
		},
		"pkg": grunt.file.readJSON("package.json")
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");

	grunt.registerTask("default", [ "jshint" ]);

};