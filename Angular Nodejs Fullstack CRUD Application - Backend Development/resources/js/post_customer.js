$(document).ready(function() {
    $("#add_new_customer").submit(function(evt) {
        evt.preventDefault();

        // PREPARE FORM DATA
        let formData = {
            firstname : $("#firstname").val(),
            lastname :  $("#lastname").val(),
            address: $("#address").val(),
            age: $("#age").val()
        }

        $.ajax({
            url: '/api/customer/create',
            type: 'POST',
            contentType : "application/json",
            data: JSON.stringify(formData),
            dataType : 'json',
            async: false,
            cache: false,
            success: function (response) {
                let customer = response.customer;
                let customerString = "{ name: " + customer.firstname + " " + customer.lastname + 
                                            ", address: " + customer.address + 
                                            ", age: " + customer.age  + " }"
                let successAlert = '<div class="alert alert-success alert-dismissible">' + 
                                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                        '<strong>' + response.message + '</strong> Customer\'s Info = ' + customerString;
                                    '</div>'
                $("#response").append(successAlert);
                $("#response").css({"display": "block"});

                resetUploadForm();
            },
            error: function (response) {
                let errorAlert = '<div class="alert alert-danger alert-dismissible">' + 
                                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                    '<strong>' + response.message + '</strong>' + ' ,Error: ' + message.error + 
                                '</div>'
                $("#response").append(errorAlert);
                $("#response").css({"display": "block"});

                resetUploadForm();
            }
        });
    });

    function resetUploadForm(){
        $("#firstname").val("");
        $("#lastname").val("");
        $("#address").val("");
        $("#age").val("");
    }

    (function(){
        let pathname = window.location.pathname;
        if(pathname === "/"){
            $(".nav .nav-item a:first").addClass("active");
        } else if (pathname == "/customers") {
            $(".nav .nav-item a:last").addClass("active");
        }
    })();
});
