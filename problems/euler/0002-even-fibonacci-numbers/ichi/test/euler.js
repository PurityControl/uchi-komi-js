var assert = require('chai').assert;
var even_fibs = require("../lib/even_fibs");

describe('Euler Tests', function() {
  it('passer the euler test for a limit of 100', function() {
      assert.equal(44, even_fibs.total_to(100));
  });
  it('passer the euler test for a limit of 4000000', function() {
      assert.equal(4613732, even_fibs.total_to(4000000));
  });
});
