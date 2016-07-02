'use strict';

describe('dataService test - ', function () {
    var service,
        $location = {
            protocol: function () {
                return 'http';
            }
        },
        $log,
        $http,
        $q,
        $rootScope,
        toastr;

    beforeEach(module('app.common'));
    beforeEach(function () {
        toastr = {
            error: jasmine.createSpy('error')
        };
    });
    beforeEach(module(function ($provide) {
        $provide.value('toastr', toastr);
        $provide.value('$location', $location);
    }));
    beforeEach(inject(
        function ($injector) {
            service = $injector.get('dataService');
            $log = $injector.get('$log');
            $rootScope = $injector.get('$rootScope');
            $http = $injector.get('$http');
            $q = $injector.get('$q');
        }
    ));

    it('test for dataService to be defined', function () {
        expect(service).toBeDefined();
    });

    it('test for search function', function () {
        var criteria = {
            title: 'test',
            year: 1900,
            page: 1
        };
        spyOn(service, 'invoke');
        var result = service.search(criteria);
        expect(service.invoke).toHaveBeenCalled();
    });

    it('test for detail function', function () {
        spyOn(service, 'invoke');
        var result = service.detail(312);
        expect(service.invoke).toHaveBeenCalled();
    });

    it('test for invoke function when response is False', function () {
        var response = {
            data: {
                Response: 'False',
                Error: 'Error'
            }
        }
        spyOn($http, 'get').and.returnValue($q.when(response));
        spyOn($log, 'error')
        var result = service.invoke('path', {});
        $rootScope.$apply();
        expect($http.get).toHaveBeenCalled();
        expect(toastr.error).toHaveBeenCalled();
        expect($log.error).toHaveBeenCalled();
    });

    it('test for invoke function when response is not True', function () {
        var response = {
            data: {
                Response: 'True'
            }
        }, resultData;
        spyOn($http, 'get').and.returnValue($q.when(response));
        var promise = service.invoke('path', {});
        promise.then(function (data) {
            resultData = data;
        });
        $rootScope.$apply();
        expect($http.get).toHaveBeenCalled();
        expect(resultData).toBe(response.data);
    });

    it('test for invoke function when server error', function () {
        spyOn($http, 'get').and.returnValue($q.reject('server error'));
        spyOn($log, 'error')
        var promise = service.invoke('path', {});
        $rootScope.$apply();
        expect($http.get).toHaveBeenCalled();
        expect(toastr.error).toHaveBeenCalled();
        expect($log.error).toHaveBeenCalled();
    });

});
