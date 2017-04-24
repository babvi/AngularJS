/**
 * DAILY REPORT PAGE CONTROLLER
 */
app.controller('dataTableCtrl', ['$scope', '$rootScope', '$http', '$q', 'DTOptionsBuilder', 'DTColumnBuilder', '$location', '$compile',
    function($scope, $rootScope, $http, $q, DTOptionsBuilder, DTColumnBuilder, $location, $compile) {
        $rootScope.hideLeftMenu = false;
        $rootScope.hideTopMenu = false;
        $rootScope.showFooter = true;

        // Call API and return result to datatable
        $scope.getDataTable = function() {
            var vm = this;
            vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                    var defer = $q.defer();
                    $http.post('../public/api/deal-report',
                        $rootScope.requestObject).success(function(result) {
                        if (!result.error) {
                            defer.resolve(result.data);
                        } else {
                            console.log('error');
                            defer.resolve([]);
                        }
                    }).error(function() {
                        defer.reject("Failed to get data");
                        $scope.ajaxError = true;
                    })
                    return defer.promise;
                }).withPaginationType('full_numbers')
                .withOption('deferRender', true)
                .withOption('searching', false)
                .withOption('bLengthChange', false)
                .withOption('bInfo', false)
                .withOption('processing', true)
                .withOption('createdRow', function(row) {
                    $compile(angular.element(row).contents())($scope);
                })

            ;
            var req = JSON.parse($rootScope.requestObject);
            vm.dtColumns = [];
            vm.dtColumns.push(DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml));
        }

    }
]);
