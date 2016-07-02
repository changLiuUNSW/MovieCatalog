'use strict';

describe('HomeController test - ', function () {
    var homeController,
        $scope,
        dataService,
        $q;
    beforeEach(module('app.home', 'app.common', 'toastr'));
    beforeEach(inject(
        function ($injector) {
            var $controller = $injector.get('$controller');
            dataService = $injector.get('dataService');
            $q = $injector.get('$q');
            $scope = $injector.get('$rootScope').$new();
            homeController = $controller('HomeController', {
                $scope: $scope
            });
        }
    ));

    it('test for homeController to be defined', function () {
        expect(homeController).toBeDefined();
    });

    it('test for reset function', function () {
        homeController.searchForm = {
            $setPristine: jasmine.createSpy('$setPristine')
        };
        homeController.reset();
        expect(homeController.criteria.title).toBeNull();
        expect(homeController.criteria.year).toBeNull();
        expect(homeController.criteria.page).toBe(1);
        expect(homeController.results).toBe(undefined);
        expect(homeController.sortColumn).toBe(undefined);
        expect(homeController.reverse).toBe(true);
        expect(homeController.searchForm.$setPristine).toHaveBeenCalled();
        expect(homeController.loading).toBe(false);
    });

    it('test for sortBy function when current sortColumn is not same with target sortColumn', function () {
        homeController.sortBy('test');
        expect(homeController.reverse).toBe(false);
        expect(homeController.sortColumn).toBe('test');
    });


    it('test for sortBy function when current sortColumn is same with target sortColumn', function () {
        homeController.sortColumn = 'test';
        homeController.sortBy('test');
        expect(homeController.reverse).toBe(false);
        expect(homeController.sortColumn).toBe('test');
    });

    it('test for search function with response', function () {
        var mockData = {
            Search: [],
            totalResults: 1
        };
        spyOn(dataService, 'search').and.returnValue($q.when(mockData));;
        homeController.search();
        $scope.$apply();
        expect(dataService.search).toHaveBeenCalledWith(homeController.criteria);
        expect(homeController.totalResults).toBe(mockData.totalResults);
        expect(homeController.results).toBe(mockData.Search);
        expect(homeController.loading).toBe(false);

    });

});
