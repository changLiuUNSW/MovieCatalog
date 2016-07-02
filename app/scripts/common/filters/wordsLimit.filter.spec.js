'use strict';

describe('wordsLimit Filter test - ', function () {
    var filter;
    beforeEach(module('app.common'));
    beforeEach(inject(
        function ($injector) {
            filter = $injector.get('wordsLimitFilter');
        }
    ));

    it('test for wordsLimit to be defined', function () {
        expect(filter).toBeDefined();
    });

    it('test for wordsLimit when total word counts are less than limit', function () {
        var testStr = 'a b c d e f g';
        var result = filter(testStr, 8);
        expect(result).toEqual(testStr);
    });

    it('test for wordsLimit when total word counts are larger than limit', function () {
        var testStr = 'a b c d e f g';
        var result = filter(testStr, 5);
        expect(result).toEqual('a b c d e');
    });
});
