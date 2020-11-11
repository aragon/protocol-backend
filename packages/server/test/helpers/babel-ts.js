// This is added to mocha --require ./test/helpers/babel-ts to allow importing .ts files in tests
require('@babel/register')({
  extensions: ['.js','.ts'],
})
