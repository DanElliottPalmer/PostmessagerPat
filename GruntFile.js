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

		"pkg": grunt.file.readJSON("package.json"),

		"uglify": {
			"dist": {
				"files": {
					"dist/PostmessagerPat.min.js": [ "src/PostmessagerPat.js" ]
				}
			}
		}

	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jsdoc");
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask("default", [ "jshint", "uglify", "jsdoc" ]);

};