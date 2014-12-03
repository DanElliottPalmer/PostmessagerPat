module.exports = function(grunt) {

	grunt.initConfig({

		"jsdoc": {
			"dist": {
				"options": {
					"destination": "doc"
				},
				"src": [ "src/*.js" ]
			}
		},

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
	grunt.loadNpmTasks("grunt-jsdoc");

	grunt.registerTask("default", [ "jshint", "jsdoc" ]);

};