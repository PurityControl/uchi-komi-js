var assert = require('chai').assert;
var multiples = require("../lib/multiples");

describe('Euler Tests', function() {
  it('passer the euler test for a limit of 10', function() {
      assert.equal(23, multiples.multiples_to(10));
  });
  it('passer the euler test for a limit of 1000', function() {
      assert.equal(233168, multiples.multiples_to(1000));
  });
});

