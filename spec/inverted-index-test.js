describe('Inverted Index', function() {
  'use strict';
  var Index = require('../src/inverted-index.js');
  var index = new Index();

  describe('Read book data', function() {
    var fileContent = [];

    index.readJsonFile('./jasmine/books.json', function(res) {
      fileContent = res;
    });

    it('ensures each object in JSON array contains a property whose value is a string', function(done) {
      setTimeout(function() {
        function checkString(anObject) {
          var keys = Object.keys(anObject);

          for(var currentIndex = 0; currentIndex < keys.length; currentIndex++) {
            expect(typeof(anObject[keys[currentIndex]])).toBe('string');
          }
        }

        fileContent.forEach(checkString);
        done();
      }, 200);
    });

    it('Books.json is not empty', function(done) {
      setTimeout (function() {
        expect(fileContent).not.toBe([]);
        expect(Array.isArray(fileContent)).toBe(true);
        done();
      }, 200);
    });
  });
});
