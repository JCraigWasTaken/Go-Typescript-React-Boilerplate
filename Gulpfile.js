const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const shell = require('gulp-shell');
const { exec } = require('child_process');
const spawn = require('cross-spawn');

const runCommand = command => {
  return cb => {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  };
};

gulp.task('go-mod-tidy', runCommand('go mod tidy'));
gulp.task('gulp-install-tools', runCommand('gulp install-tools'));
gulp.task('husky-install', runCommand('npx husky install'));
gulp.task('husky-add', function (cb) {
  const huskyFilePath = path.join('.husky', 'pre-commit');
  const command = 'npm run precommit';

  fs.readFile(huskyFilePath, 'utf8', function (err, data) {
    if (err) {
      return cb(err);
    }

    if (!data.includes(command)) {
      exec(
        `npx husky add ${huskyFilePath} "${command}"`,
        function (err, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
          cb(err);
        }
      );
    } else {
      cb();
    }
  });
});
gulp.task('format', runCommand('npm run format'));
gulp.task(
  'setup',
  gulp.series(
    'go-mod-tidy',
    'gulp-install-tools',
    'husky-install',
    'husky-add',
    'format'
  )
);

gulp.task('install-tools', function (done) {
  // Read tools.go file
  fs.readFile('src/server/tools.go', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    // Find lines with import paths
    const importLines = data.match(/_ "(.*)"/g);

    if (!importLines) {
      console.log('No tools to install.');
      done();
      return;
    }

    // Extract import paths and install tools
    for (let line of importLines) {
      const importPath = line.match(/_ "(.*)"/)[1];
      const cmd = `go install ${importPath}@latest`;
      shell.task(cmd)();
    }

    done();
  });
});

gulp.task('build:apiSchema', function () {
  return shell.task([
    'swag init -d ./src/server,./src/server/endpoints,./src/server/structs -o ./src/server/docs-autogenerated',
    'openapi --input ./src/server/docs-autogenerated/swagger.json --output ./src/client/src/api-autogenerated',
    'prettier --write ./src/client/src/api-autogenerated',
    'prettier --write ./src/server/docs-autogenerated',
  ])();
});

gulp.task('checkAPISchema', function (done) {
  var dirPath = './src/client/src/api-autogenerated';

  fs.access(dirPath, fs.constants.F_OK, err => {
    if (err) {
      console.log('Directory does not exist, running build:apiSchema...');
      shell.task('gulp build:apiSchema')();
    } else {
      console.log('Directory exists, skipping build:apiSchema');
    }
    done();
  });
});

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/:/g, '-'); // replace ':' with '-' because ':' is not allowed in docker tag
}

gulp.task('container', function () {
  const version = process.env.GITHUB_SHA
    ? process.env.GITHUB_SHA.substring(0, 7)
    : getTimestamp();

  let repoName = process.env.GITHUB_REPOSITORY;
  const imageName = repoName
    ? `ghcr.io/${repoName}`.toLowerCase()
    : 'application';

  return shell.task([`docker build --no-cache -t ${imageName}:${version} .`])();
});

gulp.task('test:go:formatting', function (done) {
  exec('gofmt -l .', function (err, stdout) {
    if (stdout) {
      console.log('Incorrectly formatted file: ' + stdout);
    } else {
      console.log('All files are formatted correctly');
    }
    if (err || stdout) {
      done(new Error('gofmt found unformatted files or reported an error.'));
    } else {
      done();
    }
  });
});

gulp.task('test:e2e:runClient', function (done) {
  const env = Object.create(process.env);
  env.BROWSER = 'none';

  const client = spawn('npm', ['run', 'start'], {
    env: env,
    cwd: './src/client',
    stdio: 'inherit',
  });

  client.on('exit', function (code) {
    if (code !== 0) {
      return done(new Error('Client exited with code ' + code));
    }
    done();
  });
});

gulp.task('test:e2e:runServer', function (done) {
  const server = spawn('npm', ['run', 'dev:server'], {
    stdio: 'inherit',
  });

  server.on('exit', function (code) {
    if (code !== 0) {
      return done(new Error('Server exited with code ' + code));
    }
    done();
  });
});

gulp.task(
  'test:e2e:runApp',
  gulp.parallel('test:e2e:runClient', 'test:e2e:runServer')
);

gulp.task('test:e2e:runTests', function (done) {
  // Delay in milliseconds (60 seconds)
  const delay = 60 * 1000;

  setTimeout(function () {
    const tests = spawn('cypress', ['run'], {
      stdio: 'inherit',
    });

    tests.on('exit', function (code) {
      if (code !== 0) {
        return done(new Error('Tests exited with code ' + code));
      }
      done();
    });
  }, delay);
});
