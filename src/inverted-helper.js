var _ = require("lodash");

/**
*@class Helper
*
* Creates helper methods for Index object.
*/
function Helper() {
  "use strict";

  /**
  * @method normalize
  *
  * Removes punctuations and changes string to lower case.
  *
  * @param {String} string
  * @return {String} returns string
  */
  this.normalize = function(string) {
    return string.replace(/[^a-zA-z\s]/g, "").toLowerCase();
  };

  /**
  * @method isValidArray
  *
  * Checks if JSON file is an array and if JSON file is empty.
  *
  * @param {Array} array
  * @return {Boolean} true or false
  */
  this.isValidArray = function(array) {
    if(!(Array.isArray(array))  || array.length === 0) {
      return false;
    }
    for(var currentIndex = 0; currentIndex < array.length; currentIndex++) {
      if((Object.keys(array[currentIndex])) === 0) {
        return false;
      }
    }

    return true;
  };

  /**
  * @method uniqueFilter
  *
  * Generates tokens from title and text.
  *
  * @param {String} title
  * @param {String} text
  * @return {Array} returns uniqWords
  */
  this.uniqueFilter = function(title, text) {
    var uniqueWords = [];

    uniqueWords = title.concat(text);
    uniqueWords = _.uniq(uniqueWords);

    return uniqueWords;
  };

  /**
  * @method getFilename
  *
  * Gets file name from filepath.
  *
  * @param {String} filepath
  * @return {String} returns filename
  */
  this.getFilename = function(filepath) {
    var filename;

    filepath = filepath.split("/");
    filename = _.last(filepath);

    return filename;
  };
}

module.exports = Helper;
