import { argv } from 'yargs';
import gulp from 'gulp';
import jest from 'gulp-jest';

gulp.task('jest', () => {
  process.env.NODE_ENV = JSON.stringify('test');
  process.env.REACT_SPINKIT_NO_STYLES = JSON.stringify(true);
  return gulp.src('./').pipe(
    jest({
      automock: false,
      verbose: true,
      collectCoverageFrom: ['src/.{js,jsx}'],
      testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/build/',
        '<rootDir>/node_modules/',
        '<rootDir>/gulpTasks/',
      ],
    })
  );
});

gulp.task('jest:cc', () => {
  process.env.NODE_ENV = 'test';
  process.env.REACT_SPINKIT_NO_STYLES = JSON.stringify(true);
  return gulp.src('./').pipe(
    jest({
      collectCoverageFrom: ['src/.{js,jsx}'],
      testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/build/',
        '<rootDir>/node_modules/',
        '<rootDir>/gulpTasks/',
      ],
      collectCoverage: true,
      automock: false,
      coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
    })
  );
});

gulp.task('jest:ccs', () => {
  process.env.NODE_ENV = 'test';
  process.env.REACT_SPINKIT_NO_STYLES = JSON.stringify(true);
  return gulp.src(argv.folder).pipe(
    jest({
      testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/build/',
        '<rootDir>/node_modules/',
        '<rootDir>/gulpTasks/',
      ],
      collectCoverageFrom: ['src/.{js,jsx}'],
      automock: false,
    })
  );
});

gulp.task('jest:threshold', () => {
  process.env.NODE_ENV = JSON.stringify('test');
  process.env.REACT_SPINKIT_NO_STYLES = JSON.stringify(true);
  return gulp.src('./').pipe(
    jest({
      automock: false,
      collectCoverage: true,
      collectCoverageFrom: ['src/**/*.{js,jsx}'],
      testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/build/',
        '<rootDir>/node_modules/',
        '<rootDir>/gulpTasks/',
      ],
      verbose: true,
      bail: true,
      coverageThreshold: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60,
        },
      },
    })
  );
});
