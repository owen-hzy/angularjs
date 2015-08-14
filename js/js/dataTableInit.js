var dataTableInit = function() {
    return {
        init: function() {
            jQuery("#accountTable").DataTable({
                "lengthMenu": [
                    10,25
                ]
            });

            jQuery("#moduleTable").DataTable({
                "lengthMenu": [10,25]
            });

            jQuery("#pendingTasksTable").DataTable({
                "lengthMenu": [10,25]
            });

            $("#pendingTasksTable_filter").hide();
        }
    };
}();
