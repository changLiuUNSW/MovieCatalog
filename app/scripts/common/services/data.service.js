'use strict';

angular.module('app.common')
    .factory('dataService', ['$http', '$q', 'toastr', '$log', '$location',
        function ($http, $q, toastr, $log, $location) {
            var PATH = $location.protocol() + '://www.omdbapi.com/';
            var service = {
                search: search,
                detail: detail,
                invoke: invoke
            };
            return service;

            function search(criteria) {
                return service.invoke(PATH, { s: criteria.title, y: criteria.year, page: criteria.page, r: 'json' });
            }

            function detail(id) {
                return service.invoke(PATH, { i: id, plot: 'full', r: 'json' });
            }

            function invoke(path, params) {
                var deferred = $q.defer();
                $http.get(PATH, {
                    params: params
                }).then(function (respose) {
                    if (respose.data && respose.data.Response === 'False') {
                        toastr.error(respose.data.Error, 'Error');
                        $log.error(respose.data.Error);
                        deferred.reject(respose.data.Error);
                    } else {
                        deferred.resolve(respose.data);
                    }
                }, function (error) {
                    toastr.error('server error', 'Error');
                    $log.error(error);
                    deferred.reject('server error');
                });
                return deferred.promise;
            }
        }]);