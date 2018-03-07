'use strict';

/*
 * This is an example Jest test case
 */

describe('Example Test', function () {
  test('Example Test 1', function () {
    expect(2 > 1).toBeTruthy();
  });
  test('Example Test 2', function () {
    expect(2 < 1).toBeFalsy();
  });
  test('Example Test 3', function () {
    var num = 1;
    expect(num.toString()).toBe('1');
  });
});
//# sourceMappingURL=example.test.js.map