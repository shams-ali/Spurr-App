angular.module('Spurr-Fact', [])
.factory('SpurrFact', function () {
  /**
   * Console log truthy input, or error message followed by input
   * @param {Any} input
   */
  const tester = function (input) {
    return input ? console.log(input) : console.log('Error, input is', input);
  };

  /**
   * Returns res with escaped quotation marks
   * @param {String} str
   * @return {String} res
   */
  const escapeText = function (str) {
    let res;
    res = str.replace(/"/g, '\\"');
    res = str.replace(/'/g, "\\'");
    return res;
  };

  return {
    test: tester,
    esc: escapeText,
  };
});
