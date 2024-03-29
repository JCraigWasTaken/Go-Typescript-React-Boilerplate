const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const shell = require('gulp-shell');
const fs = require('fs');
const { exec } = require('child_process');
const rimraf = require('rimraf');

gulp.task('server:dev', function () {
  let stream = nodemon({
    ext: 'go',
    watch: ['**/*', '!docs-autogenerated/**/*', '!db-autogenerated/**/*'],
    exec: 'swag init -d .,./endpoints,./structs -o ./docs-autogenerated && openapi --input ./docs-autogenerated/swagger.json --output ../client/src/api-autogenerated && prettier --write ../client/src/api-autogenerated && prettier --write ./docs-autogenerated && go run main.go',
    stdout: true,
    stderr: true,
  });

  stream
    .on('restart', function () {
      console.log('Server Restarted!');
    })
    .on('crash', function () {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10); // restart the server in 10 seconds
    });
});

gulp.task(
  'server:unit:test',
  shell.task([
    'go test -cover -coverprofile=coverage.out ./endpoints/...',
    'go tool cover -func=coverage.out > coverage-text.txt',
    'rimraf coverage.out',
  ])
);

gulp.task('server:unit:coverage', function (done) {
  const removeCoverage = () => {
    try {
      exec('rimraf coverage-text.txt');
    } catch (e) {
      console.error(e);
    }
  };

  const lines = fs
    .readFileSync('coverage-text.txt', 'utf-8')
    .split('\n')
    .filter(Boolean);

  const failedFiles = [];

  let minPercentage = 80.0;

  console.log('minPercentage:', minPercentage);

  console.log('Checking coverage...');

  for (let line of lines) {
    const parts = line.split(/\s+/);
    parts[2] = parts[2].replace(/%/g, '');
    const coverage = parseFloat(parts[2]);
    if (isNaN(coverage) === false && coverage < minPercentage) {
      failedFiles.push(parts[1] + ' | ' + parts[2] + '%');
    }
  }
  if (failedFiles.length > 0) {
    console.error('Functions with coverage less than ' + minPercentage + '%:');
    console.error(failedFiles.join('\n'));
    removeCoverage();
    done(new Error('Coverage check failed.'));
  } else {
    console.log('Coverage is good!');
    removeCoverage();
    done();
  }
});
