module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      css: {
        files: {
          'css/main.css': 'css/main.less'
        }
      }
    },
    watch: {
      scripts: {
        files: ['css/*.less'],
        tasks: ['less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['less']);
};
