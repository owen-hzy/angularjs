var dataTableInit = function() {
    return {
        initHistory: function(moduleId) {
            jQuery("#historyTable").DataTable({
                "lengthMenu": [10,25],
                "ajax": {
                    "url": "/WebApi/api/protected/module/" + moduleId + "/history",
                    "dataSrc": ""
                },
                "columns": [
                    {
                        "data": "actionTime"
                    },
                    {
                        "data": "learnerId",
                        "render": function(data) {
                            return "<a href=\"#/account-information/" + data + "\">" + data + "</a>";
                        }
                    },
                    {
                        "data": "username"
                    },
                    {
                        "data": "action"
                    },
                    {
                        "data": "remarks",
                        "render": function(data) {
                            return data || "";
                        }
                    }
                ]
            });
        },

        init: function() {
            jQuery("#accountTable").DataTable({
                "lengthMenu": [
                    10,25
                ],
                "ajax": {
                    "url": "/WebApi/api/protected/users",
                    "dataSrc": ""
                },
                "columns": [
                    {
                        "data": "learnerId",
                        "render": function(data) {
                            return "<a href=\"#/account-information/" + data + "\">" + data + "</a>";
                        }
                    },
                    {
                        "data": null,
                        "render": function(data) {
                            return data.username || "";
                        }
                    },
                    {
                        "data": "roles[, ]"
                    },
                    {
                        "data": null,
                        "render": function(data) {
                            var content = "";
                            for (var i = 0; i < data.modules.length; i++) {
                                content += "<a href=\"#/module-information/" + data.modules[i].moduleId + "\">" + data.modules[i].moduleId + " - " + data.modules[i].title + "</a><br />";
                            }
                            return content;
                        }
                    },
                    {
                        "data": null,
                        "render": function(data) {
                            return data.postTitle || "";
                        }
                    },
                    {
                        "data": null,
                        "render": function(data) {
                            return data.contactPhone || "";
                        }
                    },
                    {
                        "data": null,
                        "render": function(data) {
                            return data.contactEmail || "";
                        }
                    }
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
                            return "<a href=\"#/module-information/" + data.moduleId + "\">" + data.moduleId + " - " + data.title + "</a>";
                        }
                    },
                    {
                        "data": "displayStatus"
                    },
                    {
                        "data": "editStatus"
                    },
                    {
                        "data": "lastActionBy"
                    },
                    {
                        "data": "lastActionTime"
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
