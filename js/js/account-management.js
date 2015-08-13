var userTable = function() {
    return {
        init: function() {
            jQuery("#accountTable").DataTable({
                "lengthMenu": [
                    10,25
                ]
            });
        }
    };
}();
