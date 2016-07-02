'use strict';

describe('DetailController test - ', function () {
    var detailController;
    beforeEach(module('app.detail', 'app.common'));
    beforeEach(inject(
        function ($injector) {
            var $controller = $injector.get('$controller');
            var movieMock = {};
            detailController = $controller('DetailController', {
                movie: movieMock
            });
        }
    ));

    it('test for detailController to be defined', function () {
        expect(detailController).toBeDefined();
    });

    it('test for showMore function', function () {
        detailController.showMore();
        expect(detailController.showFullPlot).toBe(true);
    });
});
