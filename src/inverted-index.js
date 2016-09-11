var Helper = require('./inverted-helper.js');
var fs = require('fs');
var _ = require('lodash');

/**
* @class Index
*
* Creates an index object given the filepath,
* which consists of all the unique words in the file and a corresponding
* list of the documents in which they can be found within the file.
*/
function Index() {
  'use strict';
  var _this = this;

  this.key = '';
  this.indexObject = {};
  this.helperMethods = new Helper();

  /**
  * @method createIndex
  *
  * Creates the index object for a given filepath.
  *
  * @param {String} filepath
  * @return {Void}
  */
  this.createIndex = function(filepath) {
    if(filepath) {
      // Gets filename from filepath to serve as key in indexObject.
      _this.key = _this.helperMethods.getFilename(filepath);
      _this.indexObject[_this.key] = {};
      // Calls readJsonFile to asynchronously read JSON file.
      _this.readJsonFile(filepath, function(res) {
        _this.transformObjects(res);
      });
    } else {
      throw new Error('Cannot createIndex of ' + filepath);
    }
  };

  /**
  * @method readJsonFile
  *
  * Asynchronously reads JSON file.
  *
  * @param {String} filepath
  * @param {Function} callback
  * @return {void}
  */
  this.readJsonFile = function(filepath, callback) {
    var object;

    fs.readFile(filepath, 'utf8', function(err, data) {
      try{
        object = JSON.parse(data);
      }
      catch(error){
        throw new Error("Expected an array of JSON objects");
      }
      if(!_this.helperMethods.isValidArray(object)) {
        throw new Error('JSON file cannot be empty');
      }
      callback(object);
    });
  };

  /**
  * @method transformObjects
  *
  * Loops through an array of objects to populate the index object.
  *
  * @param {Array} arrayOfObj
  * @return {Void}
  */
  this.transformObjects = function(arrayOfObj) {
    var title,
        text;
    var uniqueArray = [];
    var arraylength = arrayOfObj.length;

    for(var objectIndex = 0; objectIndex < arraylength; objectIndex++) {
      // Removes punctuations and chages both title and text to lower case.
      // Splits title and text to array.
      title = _this.helperMethods.normalize(arrayOfObj[objectIndex].title).split(' ');
      text = _this.helperMethods.normalize(arrayOfObj[objectIndex].text).split(' ');
      // Creates an array of tokens and removes multiple occurrence of words.
      uniqueArray.push(_this.helperMethods.uniqueFilter(title,text));
    }
    // Populates the index object.
    uniqueArray.forEach(_this.makeIndexObject);
  };

  /**
  * @method makeIndexObject
  *
  * Loops through an array of tokens and populates the index object.
  *
  * @param {Array} array
  * @param {Number} location
  * @return {Void}
  */
  this.makeIndexObject = function(array, location) {
    // Loop through array of tokens
    for(var currentIndex = 0; currentIndex < array.length; currentIndex++) {
      if(_this.indexObject[_this.key].hasOwnProperty(array[currentIndex])) {
      // Push this location into the corresponding array for this token.
      _this.indexObject[_this.key][array[currentIndex]].push(location);
      } else {
        // Creates an array containing this location to correspond to the token
        _this.indexObject[_this.key][array[currentIndex]] = [location];
      }
    }
  };

  /**
  * @method getIndex
  *
  * Returns the index object for a file or term.
  *
  * @param Optional {String} filepath
  * @param Optional {String} term
  * @return {Object / Array} indexObj
  */
  this.getIndex = function(filepath, term) {
    var key;

    if(!term && !filepath) {
      return _this.indexObject;
    }
    // Get file name from a given filepath.
    key = _this.helperMethods.getFilename(filepath);
    if(!term) {
      return _this.indexObject[key];
    }

    return _this.indexObject[key][term] || [];
  };

  /**
  * @method locateTerm
  *
  * Finds a term in the index object.
  *
  * @param {String} term
  * @return {Array} indexObj[_this.key][terms]
  */
  this.locateTerm = function(terms) {
    return _this.indexObject[_this.key][terms] || [];
  };
  
}

module.exports = Index;
