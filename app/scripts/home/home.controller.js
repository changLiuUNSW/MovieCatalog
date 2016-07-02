'use strict';

angular.module('app.home')
    .controller('HomeController', ['dataService', 'constant', function (dataService, constant) {
        var vm = this;
        vm.criteria = {
            title: null,
            year: null,
            page: 1
        };
        vm.results = undefined;
        vm.sortColumn = undefined;
        vm.reverse = true;
        vm.constant = constant;
        vm.maxSize = 5;
        vm.search = search;
        vm.reset = reset;
        vm.sortBy = sortBy;


        function search(pageReset) {
            vm.loading = true;
            //reset page
            if (pageReset) {
                vm.criteria.page = 1;
            }
            dataService.search(vm.criteria).then(function (data) {
                vm.results = data.Search;
                vm.totalResults = data.totalResults;
                vm.loading = false;
            });
        }

        function reset() {
            vm.criteria.title = null;
            vm.criteria.year = null;
            vm.criteria.page = 1;
            vm.results = undefined;
            vm.sortColumn = undefined;
            vm.reverse = true;
            if (vm.searchForm) {
                vm.searchForm.$setPristine();
            }
            vm.loading = false;
        }

        function sortBy(column) {
            vm.reverse = (vm.sortColumn === column) ? !vm.reverse : false;
            vm.sortColumn = column;
        }
    }]);