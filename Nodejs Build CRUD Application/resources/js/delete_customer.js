$(document).ready(function(){
    let customerId = 0;

    $(document).on("click", "#div_customer_table table button.btn_delete", function() {
        let btn_id = (event.srcElement.id);
        customerId = btn_id.split("_")[2];

        $("div.modal-body")
            .text("Do you want delete a Customer with id = " + customerId + " ?");
    });

    $(document).on("click", "#model-delete-btn", function() {
        $.ajax({
            url: '/api/customer/deletebyid/' + customerId,
            type: 'DELETE',
            success: function(response) {
                $("div.modal-body")
                    .text("Delete successfully a Customer with id = " + customerId + "!");

                $("#model-delete-btn").remove();
                $("button.btn.btn-secondary").text("Close");

                // delete the customer row on html page
                let row_id = "tr_" + customerId;
                $("#" + row_id).remove();
                $("#div_customer_updating").css({"display": "none"});
            },
            error: function(error){
                console.log(error);
                $("#div_customer_updating").css({"display": "none"});
                alert("Error -> " + error);
            }
        });
    });
});