(function () {
    'use strict';

    angular
        .module('app', ['ngRoute'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
	        .when('/', {
                controller: 'TaskController',
                templateUrl: 'main/tasks/index.html',
                controllerAs: 'vm',
            })
            .when('/add-tasks', {
                controller: 'AddTaskController',
                templateUrl: 'main/addtasks/index.html',
                controllerAs: 'vm',
            })
            .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope','TaskService','$q'];
    function run($rootScope, TaskService,$q) {
    }

})();
