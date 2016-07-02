'use strict';

angular.module('app.common')
    .directive('myLoading', function () {
        return {
            restrict: 'AE',
            template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
        };
    });