describe('Inverted Index', function() {
  'use strict';
  var Index = require('../src/inverted-index.js');
  var index = new Index();

  describe('Read book data', function() {
    var fileContent = [];

    index.readJsonFile('./jasmine/books.json', function(res) {
      fileContent = res;
    });

    it('Ensures each object in JSON array contains a property whose value is a string', function(done) {
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

  beforeAll(function(done) {
    index.createIndex('./jasmine/test.json');
    setTimeout(function() {
      index.createIndex('./jasmine/books.json');
      done();
    },200);
  });

  describe('Populate index', function() {
    it('Create index object once file is read', function(done) {
      setTimeout (function() {
        expect(index.indexObject).not.toBe({});
        // tests if an index object is created for both JSON files
        expect(index.indexObject['books.json']).not.toBe({});
        expect(index.indexObject['test.json']).not.toBe({});
        done();
      }, 200);
    });

    it('Does not overwrite previous index', function(done) {
      setTimeout(function() {
        expect((Object.keys(index.indexObject)).length).toEqual(2);
        done();
      },200);
    });

    it('Maps string to correct object in JSON array', function(done) {
      setTimeout (function() {
        // index.getIndex takes optional arguments filepath and term
        expect(index.getIndex('./jasmine/books.json', 'of')).toEqual([0,1]);
        expect(index.getIndex('./jasmine/test.json', 'powerful')).toEqual([1]);
        // index.getIndex returns full index object for a given filepath
        expect(index.getIndex('./jasmine/books.json')).toEqual(index.indexObject['books.json']);
        // index.getIndex returns index object for all previously created files
        expect(index.getIndex()).toEqual(index.indexObject);
        done();
      }, 200);
    });
  });

  describe('Search Index', function() {
    it('Returns an array of the indices for the words in the search query', function(done) {
      setTimeout (function() {
        var startTime = new Date();
        // index.searchIndex take file path as an optional parameter
        expect(index.searchIndex('alliance of man and dwarf', './jasmine/books.json')).toEqual([[1], [0,1], [1], [0,1], [1]]);
        expect(index.searchIndex(['alliance','alice', 'old'])).toEqual([[1], [0], []]);
        // test index.searchIndex with complicated string
        expect(index.searchIndex('alliance, alice... LOVE!', './jasmine/test.json')).toEqual([[1], [0], [1]]);
        // test index.searchIndex with nested arrays
        expect(index.searchIndex([['alliance',['alice']], 'a'])).toEqual([[1], [0], [0,1]]);
        var endTime = new Date();
        // ensures search does not take too long to execute
        expect(endTime.getMilliseconds() - startTime.getMilliseconds()).toBeLessThan(5);
        done();
      }, 200);
    });
  });
});
