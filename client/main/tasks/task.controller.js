(function () {
    'use strict';

    angular
        .module('app')
        .controller('TaskController', TaskController);

    TaskController.$inject = ['TaskService', '$rootScope','$location','$http'];
    function TaskController(TaskService, $rootScope,$location,$http) {
        var vm = this;
        vm.user = null;
        vm.allUsers = [];
        vm.addNew = addNew;
        vm.clicked = clicked;
        vm.deleted = deleted;
        function init(){
            TaskService.GetTasks().then(function(data){
                makeTable(data);
            })
        }
        init();
        function makeTable(data){

            YUI().use(
              'aui-datatable',
              function(Y) {
                var columns = [
                  "title",
                  "priority",
                  "update",
                  "delete"
                ];

                var newdata = data.data['Items'];
                console.log(newdata,"ddata")
                new Y.DataTable(
                  {
                    columns: columns,
                    data: newdata
                  }
                ).render("#myDataTable");
              }
            );

            setTimeout(function(){
                $(".table-cell.table-col-delete").on( 'click', function () {
                    var datap = $(this).siblings()[0].innerHTML;
                    console.log(datap);
                    $(this).parents('tr').remove()
                    deleted(datap);
                });
                $(".table-cell.table-col-update").on( 'click', function () {
                    var datap1 = $(this).siblings()[0].innerHTML;
                    var datap2 = $(this).siblings()[1].innerHTML;
                    console.log({name:datap1,priority:datap2});
                    addNew({name:datap1,priority:datap2})
                });
            },1000)

        }

        function addNew(task){
            $rootScope.task = task ? task : null;
            window.location.hash = "#!/add-tasks"

        }
       
        function clicked(task){
            addNew(task);
        }
        function deleted(id){
            TaskService.delete(id).then(function(data){
            })
        }

        


        $rootScope.task = null;

    }

})();