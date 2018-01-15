(function () {
    'use strict';

    angular
        .module('app')
        .factory('TaskService', TaskService);

    TaskService.$inject = ['$http','$q','$rootScope'];
    function TaskService($http,$q,$rootScope) {
        
        function GetTasks() {
            return $http.get('/tasks').then(handleSuccess, handleError('Error getting all users'));
        }

        function createTask(task) {
            return $http.post('/task/create', task).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(task) {
            return $http.post('/task/update/', task).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.get('/task/destroy/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
        
        var service = {};
        window.service = service;

        service.GetTasks = GetTasks;
        service.createTask = createTask;
        service.Update = Update;
        service.delete = Delete;
        return service;


    }

})();
