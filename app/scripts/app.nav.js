'use strict';
angular.module('app')
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'scripts/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            })
            .state('detail', {
                url: '/detail/:id',
                templateUrl: 'scripts/detail/detail.html',
                controller: 'DetailController',
                controllerAs: 'vm',
                resolve: {
                    movie: ['$stateParams', 'dataService', function ($stateParams, dataService) {
                        return dataService.detail($stateParams.id).then(function (data) {
                            return data;
                        });
                    }]
                }
            });
    }
    ]);