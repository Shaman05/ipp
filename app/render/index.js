let a = require('./js/a');

module.exports.start = function () {
  console.log(`a.foo: ${a.foo}`);
  console.log('page loaded!');
};