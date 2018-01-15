(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTaskController', AddTaskController);

    AddTaskController.$inject = ['TaskService', '$rootScope','$location','$http'];
    function AddTaskController(TaskService, $rootScope,$location,$http) {
        var vm = this;
        vm.task = {};
        if($rootScope.task){
            vm.task = $rootScope.task;
            vm.task.priority = vm.task.priority.toString();
        }
        vm.addTask = addTask;
        vm.dateChanged = dateChanged;
        vm.close = close;
        window.vm = vm;
        function close(){
                $location.path('/');
        }
        function dateChanged(){
            console.log("dateChanged");
            vm.task.dueDate = $('#due').val();
        }
        function addTask(){
            if(vm.task._id){
                TaskService.Update(vm.task).then(function(data){
                    if(data){
                        $location.path('/');
                    }
                })
            }else{
                TaskService.createTask(vm.task).then(function(data){
                    if(data){
                        $location.path('/');
                    }
                })
            }
        }
    }

})();