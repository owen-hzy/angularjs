var dataTableInit = function() {
    return {
        init: function() {
            jQuery("#accountTable").DataTable({
                "lengthMenu": [
                    10,25
                ]
            });

            jQuery("#moduleTable").DataTable({
                "lengthMenu": [10,25],
                "ajax": {
                    "url": "/WebApi/api/protected/module",
                    "dataSrc": ""
                },
                "columns": [
                    {
                        "data": null,
                        "render": function(data) {
                            return data.divisionId + " - " + data.divisionName;
                        }
                    },
                    {
                        "data": null,
                        "render": function(data) {
                            return "<a href=\"#/module-information/" + data.moduleId + "\">" + data.moduleId + " - " + data.title + "</a>"
                        }
                    },
                    {
                        "data": "displayStatus"
                    },
                    {
                        "data": "editStatus"
                    },
                    {
                        "data": "owners[, ]"
                    }
                ]
            });

            jQuery("#pendingTasksTable").DataTable({
                "lengthMenu": [10,25]
            });

            $("#pendingTasksTable_filter").hide();
        }
    };
}();
