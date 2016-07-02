'use strict';

angular.module('app.detail')
    .controller('DetailController', ['movie', 'constant', function (movie, constant) {
        var vm = this;
        vm.movie = movie;
        vm.constant = constant;
        vm.showFullPlot = false;
        vm.showMore = showMore;
        vm.star = {
            model: movie.imdbRating === constant.noValue ? constant.noValue : movie.imdbRating / 2,
            maxRate: constant.IMDBMaxRate / 2
        };

        function showMore() {
            vm.showFullPlot = true;
        }
    }]);