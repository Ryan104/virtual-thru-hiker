const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');

gulp.task('default', () => {
	console.log('Starting gulp default task');
	
});

gulp.task('styles', () => {
	console.log('compiling SASS');
	gulp.src('src/sass/*.scss') // use everything that is a .scss file in the sass folder
		.pipe(sass().on('error', sass.logError)) // pipe from source through sass() compiler then to css folder
		.pipe(gulp.dest('./public/styles/'));
});

gulp.task('start', function () {
  nodemon({
	script: 'index.js',
	ext: 'js html scss hbs',
	env: { 'NODE_ENV': 'development' },
	tasks: ['styles']
  });
});
