'use strict';
// Define Route
angular.module('cleanUI', [
        'ngRoute'
    ])
    .config(['$locationProvider', '$routeProvider',
        function($locationProvider, $routeProvider) {
            $routeProvider.when('/', {
                redirectTo: '/dashboards/beta'
            });
            $routeProvider.otherwise({
                redirectTo: '/login'
            });
        }
    ]);

// Setup APP
var app = angular.module('cleanUI.controllers', ['datatables', 'ngCookies', 'myApp.config']);
// interceptor for API failure
app.factory('errorInterceptor', ['$q', '$rootScope', '$location', '$cookieStore',
    function($q, $rootScope, $location, $cookieStore) {
        return {
            request: function(config) {
                return config || $q.when(config);
            },
            requestError: function(request) {
                return $q.reject(request);
            },
            response: function(response) {
                return response || $q.when(response);
            },
            responseError: function(response) {
                if (response && response.status === 401) {
                    $rootScope.globals = {};
                    $cookieStore.remove('globals');
                    $location.path('/login');
                }
                if (response && response.status === 404) {}
                if (response && response.status >= 500) {}
                return $q.reject(response);
            }
        };
    }
]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('errorInterceptor');
}]);

// Main controller
app.controller('MainCtrl', function($location, $scope, $compile, $rootScope, $timeout, $cookieStore, $http, $config) {

    NProgress.configure({
        minimum: 0.2,
        trickleRate: 0.1,
        trickleSpeed: 200
    });
    $scope.$on('$routeChangeStart', function() {

        // NProgress Start
        $('body').addClass('cui-page-loading-state');
        NProgress.start();
    });

    // NProgress End
    setTimeout(function() {
        NProgress.done();
    }, 1000);
    $('body').removeClass('cui-page-loading-state');
});

//Custom directive for datetimepicker
app.directive('datetimepicker', [
    '$timeout',
    function($timeout) {
        return {
            require: '?ngModel',
            restrict: 'EA',
            scope: {
                datetimepickerOptions: '@',
                onDateChangeFunction: '&',
                onDateClickFunction: '&'
            },
            link: function($scope, $element, $attrs, controller) {

                $element.datetimepicker({
                    format: 'MM-DD-YYYY'
                });

                $element.on('dp.change', function() {
                    $timeout(function() {
                        var dtp = $element.data('DateTimePicker');

                        controller.$setViewValue(dtp.date());
                        $scope.onDateChangeFunction();
                    });
                });
                $element.on('click', function() {
                    $scope.onDateClickFunction();
                });
                controller.$render = function() {

                    if (!!controller && !!controller.$viewValue) {
                        var result = controller.$viewValue;

                        $element.data('DateTimePicker').date(result);
                    }
                };
                $element.datetimepicker($scope.$eval($attrs.datetimepickerOptions));
            }
        };
    }
]);
