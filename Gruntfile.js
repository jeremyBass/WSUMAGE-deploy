module.exports = function(grunt) {
	var secret=grunt.file.readJSON('secret.json');
	var testPrivateKey=grunt.file.read(secret.test.privateKey);
	var deployPrivateKey=grunt.file.read(secret.deploy.privateKey);
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		secret: grunt.file.readJSON('secret.json'),	  
		privateKey:'<%= secret.test.host %>',
		sshexec: {
			test: {
				command: 'touch testfile.txt',
				options: {
					host: '<%= secret.test.host %>',
					username: '<%= secret.test.username %>',
					privateKey: testPrivateKey
				}
			},
			deploy: {
				command: 'touch testdeployfile.txt',
				options: {
					host: '<%= secret.deploy.host %>',
					username: '<%= secret.deploy.username %>',
					privateKey: deployPrivateKey
				}
			}
		},
		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json'], // '-a' for all files
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'upstream',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-ssh');
	grunt.registerTask('default', ['sshexec:test']);

	grunt.registerTask('test', ['sshexec:test']);
	grunt.registerTask('deploy', ['sshexec:test','sshexec:deploy']);
	
};


